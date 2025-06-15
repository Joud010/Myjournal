import { CARD, SUBTITLE } from "../styles/classes";

type ToolOption = "option1" | "option2" | "option3" | "option4" | "option5" | null;

type ToolsViewProps = {
  selectedOption: ToolOption;
  setSelectedOption: React.Dispatch<React.SetStateAction<ToolOption>>;
};

function ToolsView({ selectedOption, setSelectedOption }: ToolsViewProps) {
  return (
    <div className="mt-8 md:mt-12">
      <h2 className={SUBTITLE}>Tools based on your feelings</h2>
      {!selectedOption ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => setSelectedOption(`option${num}` as ToolOption)}
              className={`${CARD} p-6 text-left hover:bg-violet-50/80 transition shadow-lg border-2 border-violet-100`}
              style={{ minHeight: 120 }}
            >
              <h3 className="font-bold text-violet-700 text-lg mb-1">Option {num}</h3>
              <p className="text-sm text-violet-400">Klicken für Details</p>
            </button>
          ))}
        </div>
      ) : (
        <div className={`${CARD} p-8 shadow-lg`}>
          <button 
            onClick={() => setSelectedOption(null)} 
            className="mb-4 text-violet-500 hover:text-violet-700 font-semibold underline underline-offset-2"
          >
            ← Zurück
          </button>
          <h3 className="text-2xl font-bold mb-3 text-violet-700">{selectedOption.toUpperCase()}</h3>
          <div className="prose max-w-none text-violet-800">
            <p>Hier kommt dein individueller Inhalt für <b>{selectedOption}</b>.</p>
            <p>Du kannst später Text, Übungen oder Tools einfügen.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ToolsView;
