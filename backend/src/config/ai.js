const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate AI-powered daily plan
 */
const generateDailyPlan = async (userGoals, availableTime, userProfile) => {
  try {
    const prompt = `
You are an expert study coach and productivity consultant. Generate a personalized daily study plan.

User Profile:
- Goals: ${userGoals}
- Available Study Time: ${availableTime} hours
- Learning Style: ${userProfile.learningStyle || 'mixed'}
- Subject Areas: ${userProfile.subjects?.join(', ') || 'General'}
- Recent Performance: ${userProfile.recentPerformance || 'Average'}

Please generate a detailed, time-boxed daily plan with:
1. Specific tasks and study activities
2. Recommended time allocation for each task
3. Priority levels (High/Medium/Low)
4. Break recommendations
5. Tips for maintaining focus

Format the response as a JSON object with a "tasks" array containing objects with properties: id, title, timeEstimate, priority, subject, description.
    `;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful study planning assistant. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse AI response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error generating daily plan:', error);
    throw new Error('Failed to generate daily plan');
  }
};

/**
 * Summarize study notes using AI
 */
const summarizeNotes = async (notes, detailLevel = 'balanced') => {
  try {
    const prompt = `
Please summarize the following study notes. Detail level: ${detailLevel}.

Notes:
${notes}

Provide:
1. Executive Summary (2-3 sentences)
2. Key Points (bullet list)
3. Important Terms and Definitions
4. Revision Bullets
5. Study Tips based on the content

Format as JSON with keys: summary, keyPoints, terms, revisionBullets, studyTips
    `;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an educational content specialist. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse AI response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error summarizing notes:', error);
    throw new Error('Failed to summarize notes');
  }
};

/**
 * Get AI recommendation for next task
 */
const getTaskRecommendation = async (upcomingTasks, userContext, completionHistory) => {
  try {
    const prompt = `
Based on the user's context and available tasks, recommend the most important task to work on next.

Upcoming Tasks:
${JSON.stringify(upcomingTasks, null, 2)}

User Context:
- Current Energy Level: ${userContext.energyLevel || 'medium'}
- Time Until Next Break: ${userContext.timeUntilBreak || '30 min'}
- Recent Completion Rate: ${userContext.completionRate || 'Unknown'}
- Focus Duration: ${userContext.focusDuration || 'Unknown'}

Completion History (Last 7 Days):
${JSON.stringify(completionHistory, null, 2)}

Provide a recommendation with:
1. Recommended Task ID
2. Reasoning (why this task now)
3. Estimated Focus Duration
4. Tips for success

Format as JSON with keys: taskId, reasoning, estimatedDuration, tips
    `;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a productivity coach assistant. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse AI response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error getting task recommendation:', error);
    throw new Error('Failed to get task recommendation');
  }
};

module.exports = {
  openai,
  generateDailyPlan,
  summarizeNotes,
  getTaskRecommendation,
};
