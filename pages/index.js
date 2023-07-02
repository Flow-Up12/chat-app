import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "./index.module.css";
import "highlight.js/styles/github.css";
import hljs from "highlight.js";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    hljs.highlightAll();
  }, [messages]);

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
        throw new Error(`Request failed with status ${response.status}`);
      }

      const newMessage = { content: animalInput, role: "user" };
      const newResponse = { content: data.result, role: "assistant" };

      // Check if the response has a code block
      const hasCodeBlock = data.result.includes("```");
      if (hasCodeBlock) {
        const codeContent = data.result.replace(/```([\s\S]+?)```/g, '</p><pre><code class="${styles.code} hljs">$1</code></pre><p>');
        newResponse.content = `<p>${codeContent}</p>`;
      } else {
        // Split the response into paragraphs
        const paragraphs = data.result.split("\n\n");
        const formattedContent = paragraphs.map((paragraph) => `<p>${paragraph}</p>\n`).join("");
        newResponse.content = formattedContent;
      }

      setMessages((prevMessages) => [...prevMessages, newMessage, newResponse]);
      setAnimalInput("");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Chat app</title>
        <link rel="icon" href="/ChatGPT_logo.png" />
      </Head>

      <main className={styles.main}>
        <img src="/ChatGPT_logo.png" className={styles.icon} alt="ChatGPT Logo" />
        <h3 className={styles.idk}>Ask anything</h3>
        <div className={styles.messageContainer}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${styles[message.role]}`}
            >
              {message.role === "assistant" && (
                <div className={styles.assistant}>
                  <img src="/ChatGPT_logo.png" className={styles.icon} alt="ChatGPT Logo" />
                  {message.content.includes("<") ? (
                    <div
                      className={styles.content}
                      dangerouslySetInnerHTML={{ __html: message.content }}
                    />
                  ) : (
                    <div>{message.content}</div>
                  )}
                </div>
              )}
              {message.role !== "assistant" && (
                <div>{message.content}</div>
              )}
            </div>
          ))}
        </div>
        <form onSubmit={onSubmit} className={styles.form}>
          <textarea
            name="animal"
            placeholder="Enter your question"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
            className={styles.input}
          />
          <input type="image" src="/enter.png" value="Generate Response" alt="submit" className={styles.button} />
        </form>
      </main>
    </div>
  );
}
