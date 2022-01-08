export default function ErrorMessage({ transfermsg, setMissingParams }) {
  if (!transfermsg) return null;

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
      <div className="flex items-center">
        <div className="text-purple-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ext-center space-y-2 sm:text-left pl-7">
          <label className="text-gray-500">{transfermsg}</label>
          <button className="px-4 m-2 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2" onClick={()=>{setMissingParams(false)}}>Understood</button>
        </div>
        
      </div>
    </div>
  );
}
