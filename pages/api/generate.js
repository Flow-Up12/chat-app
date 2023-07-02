import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    return res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
  }

  const animal = req.body.animal?.trim();
  if (!animal) {
    return res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-",
      messages: [{ role: "user", content: animal }],
    });

    const apiResponse = completion.data.choices[0].message.content;

    return res.status(200).json({ result: apiResponse });
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      return res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      return res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}
