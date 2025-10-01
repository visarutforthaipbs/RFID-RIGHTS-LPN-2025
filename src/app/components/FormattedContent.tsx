interface FormattedContentProps {
  content: string;
}

export function FormattedContent({ content }: FormattedContentProps) {
  // Split content by lines and process each line
  const lines = content.split("\n").filter((line) => line.trim() !== "");

  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        const trimmedLine = line.trim();

        // Main bullet point (•)
        if (trimmedLine.startsWith("• ")) {
          const text = trimmedLine.substring(2);
          return (
            <div key={index} className="flex items-start">
              <span className="text-green-600 font-bold text-lg mr-3 mt-0.5">
                •
              </span>
              <p className="text-gray-700 leading-relaxed flex-1">{text}</p>
            </div>
          );
        }

        // Sub bullet point (◦) with indentation
        if (trimmedLine.startsWith("◦ ")) {
          const text = trimmedLine.substring(2);
          return (
            <div key={index} className="flex items-start ml-6">
              <span className="text-gray-500 font-bold text-lg mr-3 mt-0.5">
                ◦
              </span>
              <p className="text-gray-600 leading-relaxed flex-1">{text}</p>
            </div>
          );
        }

        // Lines that start with spaces (sub-content under bullet points)
        if (line.startsWith("    ") && !trimmedLine.startsWith("◦")) {
          return (
            <div key={index} className="ml-6">
              <p className="text-gray-600 leading-relaxed">{trimmedLine}</p>
            </div>
          );
        }

        // Regular lines (no bullet points)
        return (
          <p key={index} className="text-gray-700 leading-relaxed">
            {trimmedLine}
          </p>
        );
      })}
    </div>
  );
}
