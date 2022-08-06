import * as React from 'react';

function App(): React.ReactElement {
    const [count, setCount] = React.useState<number>(0);

    return (
        <div className="p-4">
            <h1 className="text-6xl mb-4">React Minimal Boilerplate</h1>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={(): void => setCount(count + 1)}
                type="button"
            >
                Total clicks: {count}
            </button>
        </div>
    );
}

export default App;
