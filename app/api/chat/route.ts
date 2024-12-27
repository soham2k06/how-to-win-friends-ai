"use server";

import { google } from "@ai-sdk/google";
import { createDataStreamResponse, Message, streamText } from "ai";
import { NextRequest, NextResponse } from "next/server";

const systemMessageContent = `Task: Write a concise and engaging solution of Dale Carnegie's How to Win Friends and Influence People, focusing on the key takeaways.

Guidelines:
Brevity: Limit the response to a shorter length, ensuring it conveys the core messages succinctly.
Clarity: Use straightforward, accessible language while avoiding unnecessary complexity or jargon.
Examples: Include brief, relevant examples to illustrate the key principles effectively.
Structure: Organize the content into a few thematic sections for better readability.
References: Mention the chapter and topic number when providing tips directly from the book like principle 2.1.

Book principles (numbers correspond to the book's sections and dashes to the subpoints):

1. Fundamental Techniques in Handling People:
- Don’t criticize, condemn, or complain: Criticism alienates people. Instead, show empathy.
- Give honest appreciation: People crave recognition. Sincere praise motivates and builds rapport.
- Arouse an eager want: Frame requests in terms of the other person’s interests to inspire cooperation.

2. Six Ways to Make People Like You:
- Show genuine interest in others: Ask questions and listen actively to build connections.
- Smile: A simple smile makes you approachable and fosters goodwill.
- Remember names: It shows respect and personal attention.
- Be a good listener: Encourage others to talk about themselves.
- Talk in terms of their interests: Discuss what matters to them.
- Make them feel important: Acknowledge their value sincerely.

3. How to Win People to Your Way of Thinking:
- Avoid arguments: They only create resentment.
- Show respect for others’ opinions: Never say, “You’re wrong.”
- If you're wrong, admit it quickly: Acknowledge your mistakes to build trust.
- Begin in a friendly way: Approach discussions with warmth and tact.
- Get them to say 'yes' immediately: Start with points of agreement to create momentum.
- Let the other person do most of the talking: People feel valued when they are heard.
- Let them feel the idea is theirs: This motivates them to act on it.
- Try to honestly see things from the other person's perspective: Understanding their viewpoint makes collaboration easier.
- Be sympathetic to the other person’s ideas and desires.
- Appeal to the nobler motives.
- Dramatize your ideas.
- Throw down a challenge.

4. Be a Leader: Changing People Without Offense:
- Begin with praise and honest appreciation.
- Call attention to people’s mistakes indirectly.
- Talk about your own mistakes before criticizing the other person.
- Ask questions instead of giving direct orders.
- Let the other person save face.
- Praise the slightest improvement and praise every improvement. Be “hearty in your approbation and lavish in your praise.”
- Give the other person a fine reputation to live up to.
- Use encouragement. Make the fault seem easy to correct.
- Make the other person happy about doing the thing you suggest.


Deliverable:
A concise, structured, and impactful summary that captures the essence of the book's teachings, designed to resonate with readers looking to improve their interpersonal skills. Ensure the summary integrates practical insights while citing relevant chapters and topic numbers for context. Omit unrelated references, focusing solely on the principles and their practical applications.`;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const messages: Message[] = body.messages;

  try {
    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: google("gemini-2.0-flash-exp"),
          messages,
          system: systemMessageContent,
        });

        result.mergeIntoDataStream(dataStream);
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
