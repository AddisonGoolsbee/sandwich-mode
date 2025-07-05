export function Popup() {
  return (
    <div className="p-4 ">
      <h1 className="text-xl font-bold">Hello, Extension!</h1>
      <button
        className="mt-2 px-3 py-1 rounded bg-blue-500 text-white"
        onClick={() => chrome.storage.local.get("foo", (res) => alert(res.foo))}
      >
        Show Stored Value
      </button>
    </div>
  );
}
