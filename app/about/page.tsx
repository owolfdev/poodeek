// "use client";

import React from "react";
import ReactMarkdown from "react-markdown";

let markdown = ``;

function About() {
  return (
    <div className="flex flex-col sm:gap-4 gap-6 max-w-3xl w-full pt-10 pb-24 px-4">
      <h1 className="text-3xl font-bold">About Poodeek!</h1>
      <ReactMarkdown className="text-lg sm:text-base flex flex-col sm:gap-4 gap-6">
        {markdown}
      </ReactMarkdown>
    </div>
  );
}

export default About;

markdown = `

Welcome to **Poodeek!**, the unique Thai language learning app designed to bolster your linguistic capabilities one phrase at a time. Delve into the richness of the Thai language with our daily phrases and utilize the power of repetition to embed them deeply into your memory.

In Thai, Poodeek! means "Say it again!". This is the core principle of our app: repetition. We believe that repetition is the key to learning a language. Our app is designed to help you internalize the phrases you learn, ensuring that they become second nature.

**How Does Poodeek! Work?**

**Step 1: Familiarize Yourself**: Begin by acquainting yourself with our handpicked phrase of the day. Listen to its genuine pronunciation with the help of our embedded audio controls. Aim for a deeper comprehension as you delve into the nuances of each phrase.

**Step 2: Embrace Repetition**: Proceed by repeating the phrase, ensuring that each repetition reinforces the meaning and aids in mastering the pronunciation. The objective is not merely to repeat but to grasp and comprehend the essence of each word.

**Step 3: Commit to the Challenge**: We challenge you to pronounce the phrase in succession at least 50 times. This might seem demanding, but this repetition roots the phrase in your mind, enabling effortless recall. Use the built-in counter to monitor your progress and keep yourself motivated.

**Why Repetition?**  

Repetition is more than just a simple exercise; it's a scientifically proven method for effective learning. Research has consistently demonstrated that repetition is crucial in transitioning information from short-term to long-term memory, a process known as the 'spacing effect'. Revisiting and repeating information fortifies neural pathways in the brain, leading to enhanced retention and recall. *Poodeek!* taps into this cognitive principle, ensuring that you not just learn but genuinely internalize a phrase.

**Support Poodeek!** 

We are fervently committed to delivering a transformative learning journey for our users. If Poodeek has enriched your language learning, please consider backing our vision. Donations can be made to our PayPal at oliverwolfson@gmail.com. Every contribution, regardless of its size, helps us hone and augment our offerings, guaranteeing we continue to provide the pinnacle of language education.

*Happy Learning!* 🇹🇭`;
