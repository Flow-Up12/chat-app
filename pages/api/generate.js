import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: animal}],
    }); 

    console.log(completion.data.choices[0].message);

    const apiResponse = completion.data.choices[0].message.content;
    console.log(completion.data.choices[0].message); // Log the API response to the console

    res.status(200).json({ result: apiResponse });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

// function generatePrompt(animal) {
//   const capitalizedAnimal =
//     animal[0].toUpperCase() + animal.slice(1).toLowerCase();
//   return ` I am a highly intelligent question answering bot. If you ask me a question that is rooted in truth, I will give you the answer. If you ask me a question that is nonsense, trickery, or has no clear answer, I will respond with "Unknown".


//   Q: What is human life expectancy in the United States?
//   A: Human life expectancy in the United States is 78 years.
  
//   Q: Who was president of the United States in 1955?
//   A: Dwight D. Eisenhower was president of the United States in 1955.
  
//   Q: Which party did he belong to?
//   A: He belonged to the Republican Party.
  
//   Q: What is the square root of banana?
//   A: Unknown
  
//   Q: How does a telescope work?
//   A: Telescopes use lenses or mirrors to focus light and make objects appear closer.
  
//   Q: Where were the 1992 Olympics held?
//   A: The 1992 Olympics were held in Barcelona, Spain.
  
//   Q: How many squigs are in a bonk?
//   A: Unknown 

//   Q: how do i got a + b in java
//   A: System.out.print(a+b);

//   Q: Find the focal points of the conic below:
//     27x2+16y2+324x−96y+684=0
//   A: (−6,3+11‾‾‾√),(−6,3−11‾‾‾√)
  
//   Q: write me an essay
//   A:Five thousand one hundred thirty-two miles away, in the blink of an eye, my life changed. I wake up to new faces, new people, a new language, and new culture. At the age of 7, my family and I left Madrid, Spain, for what is now our new home, the United States. No one asked me what I wanted. I did not have a choice. From one week to the next, I slept on a different continent. Now it is just me, a little boy far away from home, scared of what may come. Having to acclimate to a new country was challenging. With all my friends and family left behind, I was left terrified having to start all over.
//     Waking up with the dread of walking into the first day of school at Cottonwood Elementary, I was both afraid and angry, angry at my parents for deciding to move countries and miserable, hating every day away from home. I struggled to thrive and adapt to this new culture. With such an energetic personality but a minimal understanding of English, I struggled to communicate, and making friends was the hardest. I was quiet back then. I was not too fond of it, and speaking was hard; I disliked my accent, making me sound as if I was speaking gibberish, and trying to pronounce most words was a hassle. I just wanted to be myself, and at the time, that was feeling impossible. Connecting with people was difficult, not just the language barrier but because I had little to nothing in common with anyone.
//             Five thousand one hundred thirty-two miles from home, I lay in bed dreaming of moving back. I missed my family, friends, the old house, food, everything. All I would think about was how much I hated emigrating and how I wished I was home. Finally, after seeing me struggle, my parents listened to me. They sought ways to make the transfer more manageable, enrolling me in a dual language program during my second year.
//      Once again, waking up stressing about what could happen. I stayed up late, and by morning I was exhausted. Emotions flowed through my head as I stepped foot into my first day at Denton Creek. It was exciting, a whole group of people wanting to learn more about you and who you are. I enjoyed getting to know everyone, and being able to communicate in my native language. It made me more comfortable being myself again. I finally felt enjoying my time here would be a possibility. Being more comfortable, I quickly picked up the new language, shared my culture, and learned about everyone else. 
//      I stopped being angry, and yes, I was sad being so far away from home; I missed it every day, still wanting to move back. Knowing it was out of reach, I tried my best to appreciate moving for a “better life .”.  If all I would do was resent my past, getting anywhere in life was impractical. Occasionally fear holds us back from achieving what we truly desire; for me, that was accepting my new life; for you, it could be anything. With time I realized to enjoy the moment and stop thinking about the past, to be who I am no matter the circumstances.
  
  
//   Q: ${capitalizedAnimal}
//   A:`;
// }
