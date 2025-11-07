"use client"

const getOrdinal = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[v - 10] || s[v] || s[0])
}

const index = ({ tierLength, activeIndex, setActiveIndex }: any) => {


  return (
    <div className="flex flex-wrap gap-1">
      {Array.from({ length: tierLength }, (_, i) => {
        const tierText = i === 0 ? '1st Tier Maker' : `${getOrdinal(i + 1)} Tier`
        return (
          <button
            key={i}
            className={`inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm ${activeIndex === i
              ? 'bg-blue-500 text-white shadow-md hover:shadow-lg transform hover:scale-105'
              : 'text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-800'
              }`}
            onClick={() => {
              setActiveIndex(i)
              console.log(`Selected ${tierText}`)
            }}
          >
            {tierText}
          </button>
        )
      })}
    </div>
  )
}

export default index