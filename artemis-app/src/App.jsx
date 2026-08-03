import React from 'react';
import AddRecipePage from './pages/AddRecipePage';

export default function App() {
  return (
    <div>
      <AddRecipePage onOpenLogin={() => alert('Abriendo modal de login...')} />
    </div>
  );
}