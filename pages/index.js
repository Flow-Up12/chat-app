import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [messages, setMessages] = useState([]);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      const newMessage = { content: animalInput, role: "user"};
      const newResponse = { content: data.result, role: "assistant" };
      setMessages((prevMessages) => [...prevMessages, newMessage, newResponse]);
      setAnimalInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
  
    <div className={styles.body}>
      <Head>
        <title>Chat app</title>
        <link rel="icon" href="/ChatGPT_logo.png" />
      </Head>

      <main className={styles.main}>
        <img src="/ChatGPT_logo.png" className={styles.icon} />
        <h3>Ask anything</h3>
        <div>
          {messages.map((message, index) => (
            <div key={index}>
              <div className={`${styles.message} ${styles[message.role]}`}>
                {message.content} 
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter your question"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="Generate Response" />
        </form>
      </main>
    </div>
    
  );
}
