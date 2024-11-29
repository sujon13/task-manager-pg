import React, { useState } from "react";
export const CreateExamQuestions = () => {
    const [numQuestions, setNumQuestions] = useState(0);
  const [questions, setQuestions] = useState([]);

  // Handle change in the number of questions
  const handleNumQuestionsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setNumQuestions(value > 0 ? value : 0);

    // Adjust the questions array
    setQuestions(new Array(value > 0 ? value : 0).fill({ text: "", options: ["", "", "", ""], answer: "" }));
  };

  // Handle changes in individual question fields
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field === "text") {
      updatedQuestions[index].text = value;
    } else if (field === "answer") {
      updatedQuestions[index].answer = value;
    } else {
      const [optionIndex] = field.split("-"); // For options, field will look like "option-1"
      updatedQuestions[index].options[optionIndex] = value;
    }
    setQuestions(updatedQuestions);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Exam Questions Submitted:", questions);
    alert("Questions saved successfully!");
  };

  return (
    <div style={styles.container}>
      <h2>Create Exam Questions</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label>Number of Questions:</label>
          <input
            type="number"
            min="1"
            value={numQuestions}
            onChange={handleNumQuestionsChange}
            style={styles.input}
          />
        </div>
        {questions.map((question, index) => (
          <div key={index} style={styles.questionContainer}>
            <h3>Question {index + 1}</h3>
            <input
              type="text"
              placeholder="Enter question text"
              value={question.text}
              onChange={(e) => handleQuestionChange(index, "text", e.target.value)}
              style={styles.textInput}
              required
            />
            <div style={styles.optionsContainer}>
              {question.options.map((option, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Option ${i + 1}`}
                  value={option}
                  onChange={(e) => handleQuestionChange(index, `${i}-option`, e.target.value)}
                  style={styles.optionInput}
                  required
                />
              ))}
            </div>
            <input
              type="text"
              placeholder="Correct Answer"
              value={question.answer}
              onChange={(e) => handleQuestionChange(index, "answer", e.target.value)}
              style={styles.answerInput}
              required
            />
          </div>
        ))}
        {questions.length > 0 && <button type="submit" style={styles.submitButton}>Submit Questions</button>}
      </form>
    </div>
  );
};

// Inline CSS styles
const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
  },
  questionContainer: {
    border: "1px solid #ccc",
    padding: "15px",
    borderRadius: "5px",
  },
  textInput: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    fontSize: "16px",
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  optionInput: {
    width: "100%",
    padding: "8px",
    fontSize: "14px",
  },
  answerInput: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    fontSize: "16px",
    border: "2px solid #4CAF50",
    borderRadius: "4px",
  },
  submitButton: {
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
