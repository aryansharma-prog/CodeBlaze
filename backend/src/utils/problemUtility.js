const axios = require('axios');

const JUDGE0_BASE_URL = process.env.JUDGE0_API_URL || 'https://ce.judge0.com';

const getLanguageById = (lang) => {
  if (!lang) return 54;
  const l = lang.toLowerCase().trim();
  const languageMap = {
    'c++': 54,
    'cpp': 54,
    'java': 62,
    'python': 71,
    'py': 71,
    'javascript': 63,
    'js': 63
  };
  return languageMap[l] || 54;
};

const getStatusDescription = (statusId) => {
  switch (statusId) {
    case 3: return 'Accepted';
    case 4: return 'Wrong Answer';
    case 5: return 'Time Limit Exceeded';
    case 6: return 'Compilation Error';
    case 7: return 'Runtime Error (SIGSEGV)';
    case 8: return 'Runtime Error (SIGXFSZ)';
    case 9: return 'Runtime Error (SIGFPE)';
    case 10: return 'Runtime Error (SIGABRT)';
    case 11: return 'Runtime Error (NZEC)';
    case 12: return 'Runtime Error (Other)';
    case 13: return 'Internal Error';
    case 14: return 'Exec Format Error';
    default: return 'Error';
  }
};

const submitBatch = async (submissions) => {
  try {
    const response = await axios.post(
      `${JUDGE0_BASE_URL}/submissions/batch`,
      { submissions },
      {
        params: { base64_encoded: 'false' },
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000
      }
    );

    const tokens = response.data.map((item) => item.token);
    return tokens;
  } catch (error) {
    console.error('[Judge0 submitBatch] Error:', error.response?.data || error.message);
    throw error;
  }
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const submitToken = async (tokens) => {
  const MAX_RETRIES = 12;
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      const response = await axios.get(
        `${JUDGE0_BASE_URL}/submissions/batch`,
        {
          params: {
            tokens: tokens.join(','),
            base64_encoded: 'false',
            fields: 'token,stdout,stderr,status_id,status,language_id,time,memory,compile_output,message'
          },
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );

      const { submissions } = response.data;
      if (!submissions || !Array.isArray(submissions)) {
        throw new Error('Invalid response from Judge0 batch poll');
      }

      // Status > 2 means finished processing (3=Accepted, 4=Wrong, 5=TLE, 6=CE, etc.)
      const isDone = submissions.every((r) => r.status_id > 2);

      if (isDone) {
        return submissions;
      }

      await wait(800);
      attempts++;
    } catch (error) {
      console.error('[Judge0 submitToken] Polling Error:', error.response?.data || error.message);
      if (attempts >= MAX_RETRIES - 1) throw error;
      await wait(1000);
      attempts++;
    }
  }

  throw new Error(`Judge0 execution timed out after ${MAX_RETRIES} polling attempts`);
};

module.exports = {
  getLanguageById,
  getStatusDescription,
  submitBatch,
  submitToken,
  JUDGE0_BASE_URL
};