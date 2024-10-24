import { createWorker } from 'tesseract.js';

const worker = createWorker({
  logger: (m) => console.log(m), // Optionally log progress
});

const performOCRWithWorker = async () => {
  setLoading(true);
  setProgress(0);

  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');

  const { data: { text } } = await worker.recognize(image);
  setText(text);
  
  setLoading(false);
};
