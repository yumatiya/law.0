import React, { useState } from 'react';

interface Subject {
  id: string;
  name: string;
  description: string;
}

interface SubjectNavigationProps {
  subjects: Subject[];
  onSelectSubject: (subjectId: string) => void;
}

const SubjectNavigation: React.FC<SubjectNavigationProps> = ({ subjects, onSelectSubject }) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  const handleSelect = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    onSelectSubject(subjectId);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Subjects</h2>
      <ul
        className="divide-y divide-gray-200 max-h-96 overflow-y-auto"
        role="listbox"
        aria-activedescendant={selectedSubjectId ?? undefined}
      >
        {subjects.map((subject) => (
          <li
            key={subject.id}
            className={`cursor-pointer p-3 rounded mb-2 ${
              subject.id === selectedSubjectId ? 'bg-indigo-100' : 'hover:bg-gray-100'
            }`}
            onClick={() => handleSelect(subject.id)}
            aria-selected={subject.id === selectedSubjectId ? true : false}
            role="option"
            id={subject.id}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelect(subject.id);
              }
            }}
          >
            <h3 className="text-lg font-medium">{subject.name}</h3>
            <p className="text-sm text-gray-600">{subject.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubjectNavigation;
