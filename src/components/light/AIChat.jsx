import { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/cn.js";
import {
  HiOutlinePaperAirplane,
  HiOutlineSparkles,
  HiOutlineUser,
  HiOutlineTrash,
} from "react-icons/hi2";
import { motion as Motion, AnimatePresence } from "framer-motion";

const SUGGESTED_PROMPTS = [
  "How can I improve my focus today?",
  "I'm feeling overwhelmed, what should I do?",
  "Help me plan my week effectively",
  "What's a good morning routine?",
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: "assistant",
    content: "Hello! I'm your AI life coach. I'm here to help you navigate your goals, routines, and personal growth. What would you like to work on today?",
    timestamp: new Date().toISOString(),
  },
];

export default function AIChat({ onSendMessage }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("focus") || lowerMessage.includes("distract")) {
      return "Great question! Here are some strategies to improve focus:\n\n1. **Single-tasking**: Focus on one thing at a time\n2. **Time blocking**: Dedicate specific hours to specific tasks\n3. **Remove distractions**: Put your phone away and close unnecessary tabs\n4. **Take breaks**: Use the Pomodoro technique (25 min work, 5 min break)\n\nWould you like me to help you set up a focus timer?";
    }

    if (lowerMessage.includes("overwhelm") || lowerMessage.includes("stress") || lowerMessage.includes("anxious")) {
      return "I hear you. When feeling overwhelmed, try this:\n\n1. **Breathe**: Take 5 deep breaths right now\n2. **Brain dump**: Write down everything on your mind\n3. **Prioritize**: Pick just ONE thing to do next\n4. **Start small**: Even 5 minutes of progress counts\n\nRemember: You don't have to solve everything today. What's one small step you can take right now?";
    }

    if (lowerMessage.includes("plan") || lowerMessage.includes("week")) {
      return "Let's plan your week effectively:\n\n**Monday-Wednesday**: Focus on your most important goals\n**Thursday-Friday**: Wrap up projects and prepare for next week\n**Weekend**: Rest and recharge\n\nI recommend:\n- Set 3 main priorities for the week\n- Block time for deep work each morning\n- Schedule breaks and buffer time\n\nWant me to help you create a detailed weekly plan?";
    }

    if (lowerMessage.includes("morning") || lowerMessage.includes("routine")) {
      return "A great morning routine sets the tone for your day:\n\n**Ideal Morning (60-90 min):**\n1. Wake up at consistent time\n2. Hydrate (glass of water)\n3. Light movement/stretching\n4. Mindfulness or journaling\n5. Healthy breakfast\n6. Review your top priorities\n\n**Quick Morning (15-30 min):**\n1. Wake up, hydrate\n2. 5 min stretching\n3. Quick mindfulness\n4. Set one intention for the day\n\nWhat time do you typically wake up?";
    }

    return "That's a great point to explore. Tell me more about what's on your mind. I'm here to help you think through challenges and create actionable plans.\n\nSome things we could work on:\n- Goal setting and planning\n- Building better habits\n- Managing time and energy\n- Finding clarity on next steps\n\nWhat would be most helpful for you right now?";
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    if (onSendMessage) {
      onSendMessage(userMessage.content);
    }

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const responseContent = generateResponse(userMessage.content);
    const assistantMessage = {
      id: Date.now() + 1,
      role: "assistant",
      content: responseContent,
      timestamp: new Date().toISOString(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, assistantMessage]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  const handleSuggestedPrompt = (prompt) => {
    setInputValue(prompt);
    inputRef.current?.focus();
  };

  return (
    <div className="lt-card flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-lt-border-subtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-info-500 flex items-center justify-center">
            <HiOutlineSparkles className="text-white w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-lt-text-primary">AI Coach</h3>
            <p className="text-xs text-lt-text-tertiary">Your personal guidance assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-2 text-lt-text-tertiary hover:text-lt-text-primary hover:bg-lt-bg-surface rounded-lg transition-colors"
            onClick={clearChat}
            title="Clear chat"
          >
            <HiOutlineTrash className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <Motion.div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "flex-row-reverse" : ""
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  message.role === "assistant"
                    ? "bg-gradient-to-br from-primary-500 to-info-500"
                    : "bg-lt-bg-surface border border-lt-border-default"
                )}
              >
                {message.role === "assistant" ? (
                  <HiOutlineSparkles className="w-4 h-4 text-white" />
                ) : (
                  <HiOutlineUser className="w-4 h-4 text-lt-text-secondary" />
                )}
              </div>
              <div
                className={cn(
                  "max-w-[80%] p-3 rounded-2xl text-sm",
                  message.role === "assistant"
                    ? "bg-lt-bg-surface border border-lt-border-subtle text-lt-text-primary"
                    : "bg-primary-500 text-white"
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </Motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <Motion.div
            className="flex gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-info-500 flex items-center justify-center">
              <HiOutlineSparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-lt-bg-surface border border-lt-border-subtle p-3 rounded-2xl">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-lt-text-tertiary rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-lt-text-tertiary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <span className="w-2 h-2 bg-lt-text-tertiary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
          </Motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      {messages.length <= 2 && (
        <div className="px-4 py-2">
          <p className="text-xs text-lt-text-tertiary mb-2">Suggested:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt, index) => (
              <button
                key={index}
                className="px-3 py-1.5 text-xs bg-lt-bg-surface border border-lt-border-subtle rounded-full text-lt-text-secondary hover:border-lt-primary hover:text-lt-primary transition-colors"
                onClick={() => handleSuggestedPrompt(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex items-end gap-2 p-4 border-t border-lt-border-subtle">
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask your AI coach anything..."
          className="flex-1 lt-input resize-none"
          rows={1}
          style={{ minHeight: "44px", maxHeight: "120px" }}
        />
        <Motion.button
          className={cn(
            "lt-btn lt-btn--primary",
            !inputValue.trim() && "opacity-50 cursor-not-allowed"
          )}
          onClick={handleSend}
          disabled={!inputValue.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <HiOutlinePaperAirplane className="w-4 h-4" />
        </Motion.button>
      </div>
    </div>
  );
}