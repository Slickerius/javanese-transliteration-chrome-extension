import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get('isTransliterationActive', (state) => {
      let isTransliterationStateActive = state.isTransliterationActive;
      
      if (isTransliterationStateActive === 'true') {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    });
  }, []);

  const toggle = async() => {
    if (isActive) {
      await chrome.storage.sync.set({ isTransliterationActive: 'false' });
      setIsActive(false);
    } else {
      await chrome.storage.sync.set({ isTransliterationActive: 'true' });
      setIsActive(true);
    }
  };

  return (
    <>
      <div className="min-w-64">
        <p className="text-lg text-sky-400/100 font-semibold mb-2">Javanese Transliteration</p>
        <div className="my-2">
          <div className="border-t border-gray-300"></div>
        </div>
        <div className="my-2">
          <label className="inline-flex items-center cursor-pointer">
            <span className="me-3 text-sm font-medium text-gray-900 dark:text-gray-300">Enable transliteration</span>
            <input type="checkbox" value="" className="sr-only peer" checked={isActive} onClick={toggle}/>
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </>
  )
}

export default App;
