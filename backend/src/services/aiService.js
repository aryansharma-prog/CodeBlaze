const { GoogleGenAI } = require('@google/genai');

class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_KEY || process.env.GEMINI_API_KEY || '';
  }

  getAIClient() {
    const key = process.env.GEMINI_KEY || process.env.GEMINI_API_KEY || this.apiKey;
    if (!key) return null;
    try {
      return new GoogleGenAI({ apiKey: key });
    } catch (e) {
      console.error('[AIService] Failed to initialize GoogleGenAI client:', e.message);
      return null;
    }
  }

  /**
   * Helper to execute Gemini with fallback handling
   */
  async callGemini(systemPrompt, userPrompt, temperature = 0.3) {
    const ai = this.getAIClient();
    if (!ai) {
      throw new Error('MISSING_KEY');
    }

    const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];
    let lastError = null;

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          config: {
            systemInstruction: systemPrompt,
            temperature,
            maxOutputTokens: 1200
          },
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }]
        });

        if (response && response.text) {
          return response.text;
        }
      } catch (err) {
        lastError = err;
        console.warn(`[AIService] Model ${model} failed:`, err.message);
      }
    }

    throw lastError || new Error('All Gemini models failed');
  }

  /**
   * Parse structured JSON from AI or gracefully extract
   */
  parseJSONResponse(text, fallbackType = 'info') {
    if (!text) return null;
    try {
      // Find JSON block ```json ... ``` or first { ... }
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/(\{[\s\S]*\})/);
      const jsonStr = jsonMatch ? jsonMatch[1] : text;
      return JSON.parse(jsonStr);
    } catch (e) {
      return {
        type: fallbackType,
        summary: text.slice(0, 120),
        explanation: text,
        hint: "Review your approach and algorithm constraints.",
        suggestedFix: null
      };
    }
  }

  /**
   * 1. 💡 Generate Hint
   */
  async generateHint({ title, description, code, language, userWeaknesses }) {
    const systemPrompt = `You are CodeBlaze AI Mentor, a world-class DSA and Competitive Programming Coach.
Your goal is to give a smart, progressive conceptual hint without giving away the complete code solution.
Format your answer as JSON:
{
  "type": "hint",
  "summary": "Brief 1-sentence conceptual clue",
  "hint": "Detailed guidance on the core data structure or invariant to consider",
  "nextStep": "A question to guide the user's next thought"
}`;

    const userPrompt = `Problem: ${title || 'Coding Problem'}
Description: ${description || 'Not provided'}
Language: ${language || 'C++'}
User's Current Code:
\`\`\`${language}
${code || '// empty'}
\`\`\`
${userWeaknesses?.length ? `User known practice areas: ${userWeaknesses.join(', ')}` : ''}

Provide a targeted conceptual hint for their current code and approach.`;

    try {
      const raw = await this.callGemini(systemPrompt, userPrompt, 0.4);
      return this.parseJSONResponse(raw, 'hint');
    } catch (err) {
      return this.fallbackHint({ title, description, code, language });
    }
  }

  /**
   * 2. 🐛 Debug Code (with deep contextual analysis)
   */
  async debugCode({ title, description, code, language, testcase, stdout, stderr, compileError, runtimeError }) {
    const systemPrompt = `You are CodeBlaze AI Mentor. Analyze the user's code, the problem statement, and the execution/compiler failure.
Identify precisely what went wrong, why it occurred, and where the logical or runtime issue is located.
Do NOT simply give the complete code replacement. Guide them systematically.
Return STRICT JSON:
{
  "type": "debug",
  "summary": "Short 1-sentence summary of the bug",
  "issue": "Specific explanation of what failed (e.g. index out of bounds, infinite loop, integer overflow)",
  "location": "Line or loop/condition where the issue occurs",
  "explanation": "Why this happens given the testcase and logic",
  "hint": "How to think about fixing it",
  "suggestedFix": "Code snippet or pseudocode showing the corrected condition/line"
}`;

    const userPrompt = `Problem: ${title || 'Problem'}
Language: ${language || 'C++'}
Current Code:
\`\`\`${language}
${code || ''}
\`\`\`
Testcase input: ${testcase || 'N/A'}
Stdout: ${stdout || 'None'}
Stderr: ${stderr || 'None'}
Compiler Error: ${compileError || 'None'}
Runtime Error: ${runtimeError || 'None'}`;

    try {
      const raw = await this.callGemini(systemPrompt, userPrompt, 0.2);
      return this.parseJSONResponse(raw, 'debug');
    } catch (err) {
      return this.fallbackDebug({ code, language, compileError, runtimeError, stderr, stdout });
    }
  }

  /**
   * 3. 🧠 Explain Code
   */
  async explainCode({ title, description, code, language }) {
    const systemPrompt = `You are CodeBlaze AI Mentor. Break down and explain the user's code step by step.
Return JSON:
{
  "type": "explain",
  "summary": "High level overview of what this algorithm does",
  "steps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
  "edgeCasesHandled": "Which edge cases are covered or missed",
  "keyMechanisms": "Core data structure or invariant used"
}`;

    const userPrompt = `Code in ${language}:\n\`\`\`${language}\n${code}\n\`\`\``;

    try {
      const raw = await this.callGemini(systemPrompt, userPrompt, 0.2);
      return this.parseJSONResponse(raw, 'explain');
    } catch (err) {
      return this.fallbackExplain({ code, language });
    }
  }

  /**
   * 4. ⏱ Analyze Complexity
   */
  async analyzeComplexity({ title, description, code, language }) {
    const systemPrompt = `You are CodeBlaze AI Mentor. Analyze the Big-O Time and Space Complexity of the provided code.
Return STRICT JSON:
{
  "type": "complexity",
  "timeComplexity": "O(...)",
  "timeReason": "Detailed breakdown of loops, recursions, and operations",
  "spaceComplexity": "O(...)",
  "spaceReason": "Memory usage for auxiliary arrays, recursion stack, or data structures",
  "isOptimal": true or false,
  "optimalComparison": "Explanation of theoretical best bound for this problem"
}`;

    const userPrompt = `Problem: ${title}\nCode (${language}):\n\`\`\`${language}\n${code}\n\`\`\``;

    try {
      const raw = await this.callGemini(systemPrompt, userPrompt, 0.1);
      return this.parseJSONResponse(raw, 'complexity');
    } catch (err) {
      return this.fallbackComplexity({ code, language });
    }
  }

  /**
   * 5. 🧪 Analyze Testcase
   */
  async analyzeTestcase({ title, description, code, language, testcase, expectedOutput, actualOutput }) {
    const systemPrompt = `You are CodeBlaze AI Mentor. Explain why the user's code produced the observed output for the given testcase.
Return JSON:
{
  "type": "testcase_analysis",
  "summary": "Why the output differs from expected",
  "trace": "Step-by-step trace of key variables on this input",
  "mismatchReason": "Exact step where logic deviated",
  "recommendation": "Adjustment needed to handle this testcase"
}`;

    const userPrompt = `Problem: ${title}\nCode (${language}):\n\`\`\`${language}\n${code}\n\`\`\`\nInput: ${testcase}\nExpected: ${expectedOutput}\nActual: ${actualOutput}`;

    try {
      const raw = await this.callGemini(systemPrompt, userPrompt, 0.2);
      return this.parseJSONResponse(raw, 'testcase_analysis');
    } catch (err) {
      return {
        type: 'testcase_analysis',
        summary: `Actual output (${actualOutput ?? 'null'}) does not match expected (${expectedOutput ?? 'null'}).`,
        trace: `Input: ${testcase}`,
        mismatchReason: "Execution deviated from the target specification.",
        recommendation: "Check loop termination condition and zero-index offsets."
      };
    }
  }

  /**
   * 6. 🚀 Optimize Code
   */
  async optimizeCode({ title, description, code, language }) {
    const systemPrompt = `You are CodeBlaze AI Mentor. Analyze potential algorithmic and memory optimizations for this code.
Return JSON:
{
  "type": "optimize",
  "currentApproach": "Current time/space strategy",
  "betterApproach": "Target algorithmic paradigm (e.g. Two Pointers, Hash Map, Segment Tree)",
  "bottleneck": "What slows down the current solution",
  "optimizationHints": ["Hint 1...", "Hint 2..."],
  "expectedComplexity": "Target Time O(...) and Space O(...)"
}`;

    const userPrompt = `Problem: ${title}\nCode (${language}):\n\`\`\`${language}\n${code}\n\`\`\``;

    try {
      const raw = await this.callGemini(systemPrompt, userPrompt, 0.3);
      return this.parseJSONResponse(raw, 'optimize');
    } catch (err) {
      return {
        type: 'optimize',
        currentApproach: "Linear or quadratic scan",
        betterApproach: "Hash Table / Two Pointers / Binary Search",
        bottleneck: "Repeated iterations or nested lookups",
        optimizationHints: [
          "Can you precompute frequencies or prefix sums to answer queries in O(1)?",
          "If the array can be sorted or accessed with two pointers, complexity might drop from O(n^2) to O(n log n) or O(n)."
        ],
        expectedComplexity: "O(n) Time, O(1) or O(n) Space"
      };
    }
  }

  /**
   * 7. 📚 Explain Concept
   */
  async explainConcept({ concept, topic, subtopic }) {
    const systemPrompt = `You are CodeBlaze AI Mentor. Provide a clear, intuitive, and diagrammatic explanation of the requested DSA concept.
Return JSON:
{
  "type": "concept",
  "concept": "${concept || topic}",
  "topic": "${topic || 'General DSA'}",
  "subtopic": "${subtopic || ''}",
  "summary": "Core definition and intuition",
  "whenToUse": ["Scenario 1", "Scenario 2"],
  "keyInvariants": ["Invariant 1", "Invariant 2"],
  "templateSnippet": "Pseudocode or clean standard template",
  "commonPitfalls": ["Pitfall 1", "Pitfall 2"]
}`;

    const userPrompt = `Explain the concept: ${concept || topic} (Subtopic: ${subtopic || 'General'})`;

    try {
      const raw = await this.callGemini(systemPrompt, userPrompt, 0.3);
      return this.parseJSONResponse(raw, 'concept');
    } catch (err) {
      return {
        type: 'concept',
        concept: concept || topic || "DSA Fundamentals",
        topic: topic || "Algorithms",
        subtopic: subtopic || "",
        summary: `The ${concept || topic} pattern is a fundamental problem-solving technique in Data Structures and Algorithms.`,
        whenToUse: [
          "When you need to search, partition, or process collections efficiently.",
          "When reducing redundant subproblems or nested scans."
        ],
        keyInvariants: [
          "State transition correctness at each step.",
          "Boundary condition validation (0-indexed limits, null checks)."
        ],
        templateSnippet: "// Standard two pointer / sliding window template\nint left = 0, right = 0;\nwhile (right < n) {\n  // expand window\n  right++;\n}",
        commonPitfalls: ["Off-by-one errors", "Failing to update state on shrink step"]
      };
    }
  }

  /**
   * 8. 💬 Interactive Chat with Mentor
   */
  async chatWithMentor({ messages, title, description, code, language, errors, userWeaknesses }) {
    const systemPrompt = `You are BlazeAI, an expert competitive programming and DSA mentor inside CodeBlaze.
Strict Rules:
1. ONLY answer questions related to Data Structures, Algorithms, time/space complexity, code debugging, and coding practice.
2. If unrelated, politely redirect back to coding.
3. Be concise, technical, encouraging, and developer-focused.
4. Understand the user's current code context, compiler errors, and topic weaknesses.
5. Provide hints, step-by-step reasoning, and pseudocode rather than immediately writing the full answer unless explicitly asked after multiple attempts.

Context:
Problem: ${title || 'DSA Problem'}
Language: ${language || 'C++'}
Current Code:
\`\`\`${language}
${code || '// No code written yet'}
\`\`\`
${errors ? `Recent Error: ${errors}` : ''}
${userWeaknesses?.length ? `User is practicing: ${userWeaknesses.join(', ')}` : ''}`;

    const formattedMessages = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content || m.text || '' }]
    }));

    const ai = this.getAIClient();
    if (!ai) {
      const lastUserMsg = messages[messages.length - 1]?.content || '';
      return this.fallbackChatResponse(lastUserMsg, { title, code, language, errors });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.4,
          maxOutputTokens: 1024
        },
        contents: formattedMessages
      });

      return {
        role: 'assistant',
        content: response.text || "I analyzed your code. How can I assist you with your current approach?"
      };
    } catch (err) {
      console.warn('[AIService] chatWithMentor fallback activated:', err.message);
      const lastUserMsg = messages[messages.length - 1]?.content || '';
      return this.fallbackChatResponse(lastUserMsg, { title, code, language, errors });
    }
  }

  /**
   * 9. 📊 Analyze Assessment Results
   */
  async analyzeAssessment({ questions, answers, score, topicBreakdown, weakTopics, weakSubtopics, strongTopics }) {
    const systemPrompt = `You are the CodeBlaze Personalized DSA Coach.
Analyze the user's assessment test performance.
Return STRICT JSON:
{
  "summary": "Overall assessment summary (2-3 sentences)",
  "strengths": ["Strength 1...", "Strength 2..."],
  "weaknesses": ["Weakness 1...", "Weakness 2..."],
  "actionPlan": ["Immediate Step 1", "Step 2", "Step 3"],
  "mentorNote": "Encouraging personalized note on which topic to tackle first"
}`;

    const userPrompt = `Score: ${score}/100
Weak Topics: ${weakTopics?.join(', ') || 'None'}
Weak Subtopics: ${weakSubtopics?.join(', ') || 'None'}
Strong Topics: ${strongTopics?.join(', ') || 'None'}
Topic Breakdown: ${JSON.stringify(topicBreakdown || [])}`;

    try {
      const raw = await this.callGemini(systemPrompt, userPrompt, 0.3);
      return this.parseJSONResponse(raw, 'assessment_analysis');
    } catch (err) {
      return {
        summary: `You scored ${score}% on your DSA Assessment. You demonstrated strong understanding in ${strongTopics?.slice(0, 2).join(' and ') || 'foundational areas'}, with key opportunities for growth in ${weakTopics?.slice(0, 2).join(' and ') || 'advanced algorithmic techniques'}.`,
        strengths: strongTopics?.length ? strongTopics.map(t => `Solid grasp of ${t} traversal and core logic`) : ["Foundational problem understanding"],
        weaknesses: weakSubtopics?.length ? weakSubtopics.map(s => `Struggled with ${s} state tracking and edge cases`) : ["Complex interval and boundary handling"],
        actionPlan: [
          `Review the core theory for ${weakTopics?.[0] || 'Sliding Window & Two Pointers'}.`,
          `Solve 3 curated Easy problems in ${weakSubtopics?.[0] || 'array traversal'} to build muscle memory.`,
          `Retake a Topic Assessment to verify score improvement.`
        ],
        mentorNote: `Focusing on ${weakTopics?.[0] || 'your weakest topic'} first will yield the highest performance gains for technical interviews.`
      };
    }
  }

  /* ── Fallbacks for Offline / Keyless / Rate-limited environments ── */

  fallbackHint({ title, description, code, language }) {
    let hint = "Consider the relationship between input size and required time complexity.";
    let summary = "Look for monotonic properties or hash map caching opportunities.";
    if (code && (code.includes('for') || code.includes('while'))) {
      hint = "Check if you can reduce nested loops by utilizing a Hash Table or Two Pointers technique.";
      summary = "Consider optimizing inner lookups to O(1).";
    }
    return {
      type: "hint",
      summary,
      hint,
      nextStep: "What data structure allows you to query previously visited elements in constant time?"
    };
  }

  fallbackDebug({ code, language, compileError, runtimeError, stderr, stdout }) {
    const errorText = compileError || runtimeError || stderr || '';
    let issue = "Potential logic or boundary mismatch.";
    let location = "Loop bounds or variable initialization";
    let hint = "Verify that all array indices stay strictly within 0 to size-1.";
    let suggestedFix = "// Ensure index < array.size() and check edge cases like empty inputs";

    if (errorText.toLowerCase().includes('out of bounds') || errorText.toLowerCase().includes('segmentation fault')) {
      issue = "Out-of-bounds array access detected.";
      location = "Array indexing / vector subscript operator";
      hint = "Inspect your loop condition. In 0-indexed arrays, accessing `nums[i + 1]` when `i == n - 1` triggers an out-of-bounds error.";
      suggestedFix = "for (int i = 0; i < n - 1; i++) { /* safe lookahead */ }";
    } else if (errorText.toLowerCase().includes('compilation error') || compileError) {
      issue = "Syntax or type mismatch during compilation.";
      location = "Check semicolon, missing headers, or return types";
      hint = "Ensure all types are properly cast and standard library functions are included.";
    }

    return {
      type: "debug",
      summary: issue,
      issue,
      location,
      explanation: errorText || "The current solution fails on target edge cases or exceeds bounds.",
      hint,
      suggestedFix
    };
  }

  fallbackExplain({ code, language }) {
    return {
      type: "explain",
      summary: `A ${language || 'C++'} solution implementing standard algorithm flow.`,
      steps: [
        "1. Initializes input parameters and tracking structures.",
        "2. Traverses elements while updating local state and accumulator variables.",
        "3. Returns or prints the computed result."
      ],
      edgeCasesHandled: "Standard non-empty input sequences.",
      keyMechanisms: "Linear scan and state accumulation."
    };
  }

  fallbackComplexity({ code, language }) {
    const hasNestedLoop = /for\s*\(.*for\s*\(|while\s*\(.*while\s*\(/.test(code || '');
    const hasSingleLoop = /for\s*\(|while\s*\(/.test(code || '');
    const timeComp = hasNestedLoop ? "O(n^2)" : hasSingleLoop ? "O(n)" : "O(1)";
    const spaceComp = code && (code.includes('vector') || code.includes('Map') || code.includes('unordered_map') || code.includes('set')) ? "O(n)" : "O(1)";

    return {
      type: "complexity",
      timeComplexity: timeComp,
      timeReason: hasNestedLoop ? "Nested loops iterating across array length n." : hasSingleLoop ? "Single linear pass over n elements." : "Constant time arithmetic operations.",
      spaceComplexity: spaceComp,
      spaceReason: spaceComp === "O(n)" ? "Allocates auxiliary data structures proportional to input size." : "Uses O(1) scalar stack memory.",
      isOptimal: !hasNestedLoop,
      optimalComparison: "Most array problems can be solved in O(n) time using hashing or two pointers."
    };
  }

  fallbackChatResponse(userMsg, { title, code, language, errors }) {
    const lower = userMsg.toLowerCase();
    if (lower.includes('hint')) {
      return {
        role: 'assistant',
        content: `💡 **Mentor Hint**: For **${title || 'this problem'}**, consider what invariant must hold at each step. If you're scanning linearly, can a Hash Map or Two Pointers eliminate redundant inner work?`
      };
    }
    if (lower.includes('debug') || lower.includes('error') || lower.includes('why')) {
      return {
        role: 'assistant',
        content: `🐛 **Debug Analysis**: Looking at your **${language || 'C++'}** code${errors ? ` and the error (\`${errors}\`)` : ''}:\n\n1. Check your boundary conditions: ensure indices do not exceed array length.\n2. Verify that base cases for empty or 1-element inputs are handled.\n3. Make sure return values match expected types.`
      };
    }
    if (lower.includes('complexity')) {
      return {
        role: 'assistant',
        content: `⏱ **Complexity Breakdown**: Your current approach appears to run in linear or near-linear time. Remember that optimal DSA solutions generally aim for **O(n)** time and **O(1)** or **O(n)** space.`
      };
    }
    return {
      role: 'assistant',
      content: `I am your **CodeBlaze AI Mentor**. I'm here to help with your code for **${title || 'this problem'}**. You can ask me for a conceptual hint, help debugging an error, code explanations, or complexity analysis!`
    };
  }
}

module.exports = new AIService();
