const recordBtn = document.getElementById('record-btn');
const clearBtn = document.getElementById('clear-btn');
const sampleBtn = document.getElementById('sample-btn');
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

sampleBtn.addEventListener('click', () => {
  if (isRecording) {
    toggleRecording(false);
  }

  const sampleText =
    'Metformin, 500 milligrams, take one tablet by mouth twice daily. ' +
    'Lisinopril, 10 milligrams, one tablet by mouth each morning. ' +
    'Atorvastatin, 20 milligrams, one tablet nightly with dinner.';

  transcriptBuffer = sampleText;
  transcriptEl.textContent = sampleText;
  handleTranscript(sampleText);
  statusEl.textContent = 'Sample list loaded. Use the mic to capture your own meds.';
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
    .replace(/\band\b/gi, '|')
    .replace(/[.;\n]+/g, '|');
  const rawItems = cleaned.split('|').map(entry => entry.trim()).filter(Boolean);
  const dosageRegex = /\b(\d+(?:\.\d+)?\s*(?:mg|mcg|g|gram|grams|milligram|milligrams|microgram|micrograms|units?|iu|ml|milliliters?|pills?|tablets?|capsules?))/i;

  return rawItems.map((entry, index) => {
    const commaSplit = entry.split(',').map(s => s.trim()).filter(Boolean);
    let name = `Medication ${index + 1}`;
    let dosage = 'Dose not captured';
    let instructions = 'No directions provided';
    let note = '—';

    if (commaSplit.length >= 2) {
      name = commaSplit[0];
      const remainder = commaSplit.slice(1).join(', ');
      const doseMatch = remainder.match(dosageRegex);
      if (doseMatch) {
        dosage = doseMatch[1];
        const afterDose = remainder
          .replace(doseMatch[0], '')
          .replace(/^[,\s-]+|[,\s-]+$/g, '')
          .trim();
        instructions = afterDose || instructions;
      } else {
        dosage = commaSplit[1];
        instructions = commaSplit.slice(2).join(', ').trim() || instructions;
      }
      const leftover = remainder
        .replace(doseMatch?.[0] ?? '', '')
        .replace(instructions, '')
        .replace(/^[,\s-]+|[,\s-]+$/g, '')
        .trim();
      if (leftover) note = leftover;
    } else {
      const doseMatch = entry.match(dosageRegex);
      if (doseMatch) {
        name = entry.slice(0, doseMatch.index).replace(/[,-]+$/, '').trim() || name;
        dosage = doseMatch[1];
        const afterDose = entry
          .slice(doseMatch.index + doseMatch[0].length)
          .replace(/^[,\s-]+/, '')
          .trim();
        instructions = afterDose || instructions;
      } else {
        name = entry || name;
      }
    }

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
