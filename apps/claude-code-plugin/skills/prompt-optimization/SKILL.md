---
name: prompt-optimization
description: Helps users write more efficient prompts to reduce token costs
---
fvc
This skill activates when users ask about reducing their LLM token costs or optimizing prompts.

When triggered, suggest:
1. Use clear, direct language — skip filler words and politeness markers in technical prompts
2. Lead with the action: "Explain X" not "Could you please explain X?"
3. Use bullet points for lists instead of prose descriptions
4. Reference prior context instead of repeating it
5. Break long conversations into focused sessions

Example transformations:
- "Could you please explain..." → "Explain..."
- "I was wondering if you could help me with..." → direct request
- "Basically what I want is..." → just state the request
- "S'il te plaît, est-ce que tu pourrais..." → direct imperative

If Trimly data is available, reference the user's actual savings stats.
