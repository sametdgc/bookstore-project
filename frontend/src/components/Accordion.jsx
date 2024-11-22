import React, { useState } from "react";

export const Accordion = ({ children }) => {
  return <div className="space-y-2">{children}</div>;
};

export const AccordionItem = ({ children, value }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-md">
      {React.Children.map(children, (child) => {
        if (child.type === AccordionTrigger) {
          return React.cloneElement(child, {
            isOpen,
            onClick: () => setIsOpen(!isOpen),
          });
        }
        if (child.type === AccordionContent) {
          return isOpen ? child : null;
        }
        return child;
      })}
    </div>
  );
};

export const AccordionTrigger = ({ children, isOpen, onClick }) => {
  return (
    <button
      className="flex justify-between w-full px-4 py-2 text-left"
      onClick={onClick}
    >
      {children}
      <span>{isOpen ? "▲" : "▼"}</span>
    </button>
  );
};

export const AccordionContent = ({ children }) => {
  return <div className="px-4 py-2">{children}</div>;
};
