const recordBtn = document.getElementById('record-btn');
const clearBtn = document.getElementById('clear-btn');
const statusEl = document.getElementById('status');
const transcriptEl = document.getElementById('transcript-text');
const medList = document.getElementById('med-list');
const emptyState = document.getElementById('list-empty');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
let isRecording = false;
let transcriptBuffer = '';
let medications = [];

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = true;
  recognition.continuous = true;

  recognition.onresult = event => {
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const result = event.results[i];
      if (result.isFinal) {
        transcriptBuffer += ` ${result[0].transcript}`;
        handleTranscript(transcriptBuffer.trim());
      } else {
        interim += result[0].transcript;
      }
    }
    transcriptEl.textContent = `${transcriptBuffer} ${interim}`.trim();
  };

  recognition.onerror = event => {
    statusEl.textContent = `Speech recognition error: ${event.error}`;
    toggleRecording(false);
  };

  recognition.onend = () => {
    if (isRecording) {
      recognition.start();
    } else {
      statusEl.textContent = 'Press start to begin listening.';
      recordBtn.classList.remove('recording');
    }
  };
} else {
  recordBtn.disabled = true;
  recordBtn.textContent = 'Speech API unavailable';
  statusEl.textContent = 'Your browser does not support the Web Speech API. Try Chrome or Edge.';
}

recordBtn?.addEventListener('click', () => {
  if (!SpeechRecognition) return;
  toggleRecording(!isRecording);
});

clearBtn.addEventListener('click', () => {
  medications = [];
  transcriptBuffer = '';
  transcriptEl.textContent = '(waiting for speech)';
  renderMedications();
});

function toggleRecording(shouldRecord) {
  isRecording = shouldRecord;
  if (shouldRecord) {
    transcriptBuffer = '';
    recognition.start();
    recordBtn.classList.add('recording');
    recordBtn.textContent = 'Stop listening';
    statusEl.textContent = 'Listening... speak each medication separated by pauses or "and".';
  } else {
    recognition.stop();
    recordBtn.classList.remove('recording');
    recordBtn.textContent = '🎙️ Start talking';
    statusEl.textContent = 'Press start to begin listening.';
  }
}

function handleTranscript(text) {
  const parsed = parseMedications(text);
  medications = parsed;
  renderMedications();
}

function parseMedications(text) {
  const cleaned = text
    .replace(/\sand\s/gi, '|')
    .replace(/[.;\n]+/g, '|');
  const rawItems = cleaned.split('|').map(entry => entry.trim()).filter(Boolean);

  return rawItems.map((entry, index) => {
    const segments = entry.split(',').map(s => s.trim()).filter(Boolean);
    const name = segments.shift() || `Medication ${index + 1}`;
    const dosage = segments.shift() || 'Dose not captured';
    const instructions = segments.shift() || 'No directions provided';
    const note = segments.length ? segments.join(', ') : '—';

    return { name, dosage, instructions, note };
  });
}

function renderMedications() {
  medList.innerHTML = '';
  if (!medications.length) {
    emptyState.hidden = false;
    medList.hidden = true;
    return;
  }

  emptyState.hidden = true;
  medList.hidden = false;

  medications.forEach((med, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="index">${idx + 1}</span>
      <span class="name">${med.name}</span>
      <span class="dosage">${med.dosage}</span>
      <span class="instructions">${med.instructions}</span>
      <span class="note">${med.note}</span>
    `;
    medList.appendChild(li);
  });
}

renderMedications();
