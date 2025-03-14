export default function Card({ title, description, imageUrl }) {
    return (
        <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white">
            {imageUrl && (
                <img className="w-full" src={imageUrl} alt={title} />
            )}
            <div className="px-6 py-4">
                <h2 className="font-bold text-xl mb-2 text-gray-800">{title}</h2>
                <p className="text-gray-700 text-base">
                    {description}
                </p>
            </div>
            <div className="px-6 pt-4 pb-2">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    #tailwind
                </span>
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    #css
                </span>
            </div>
        </div>
    );
}
