import React, {useState, useEffect, useMemo} from 'react'
import StationSelect from '../components/StationSelect'
import SortControls from '../components/SortControls'
import TrainCard from '../components/TrainCard'
import ComboCard from '../components/ComboCard'
import Loader from '../components/Loader'
import {findDirectTrains, findTwoLegCombos, calcPrice, formatINR} from '../utils'


// Hardcoded data for stations and trains
const hardcodedStations = [
  { id: 'ST1', name: 'Station 1' },
  { id: 'ST2', name: 'Station 2' },
  { id: 'ST3', name: 'Station 3' },
  { id: 'ST4', name: 'Station 4' },
]

const hardcodedTrains = [
  { id: 'T1', source: 'ST1', destination: 'ST2', price: 500, departMinutes: 480, durationMinutes: 120 },
  { id: 'T2', source: 'ST2', destination: 'ST3', price: 400, departMinutes: 600, durationMinutes: 90 },
  { id: 'T3', source: 'ST1', destination: 'ST3', price: 800, departMinutes: 540, durationMinutes: 180 },
  { id: 'T4', source: 'ST3', destination: 'ST4', price: 600, departMinutes: 720, durationMinutes: 150 },
]

export default function SearchPage(){
  const [stations, setStations] = useState([])
  const [trains, setTrains] = useState([])
  const [source, setSource] = useState('')
  const [destination, setDestination] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState({direct: [], combos: []})
  const [sortBy, setSortBy] = useState('price_asc')
  const [maxLayoverHours, setMaxLayoverHours] = useState(8)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setStations(hardcodedStations)
      setTrains(hardcodedTrains)
      setLoading(false)
    }, 500) // Simulated delay
  }, [])

  const onSearch = ()=>{
    setError(null)
    if(!source || !destination){
      setError('Please choose both source and destination')
      return
    }
    if(source === destination){
      setError('Source and Destination cannot be the same')
      return
    }
    setLoading(true)

    // Compute direct trains & combos
    setTimeout(()=>{ // simulate small compute delay
      const direct = findDirectTrains(trains, source, destination)
      const combos = findTwoLegCombos(trains, source, destination, {maxLayoverHours})
      setResults({direct, combos})
      setLoading(false)
    }, 300)
  }

  // Sorting application
  const sortedResults = useMemo(()=>{
    const cmpFuncs = {
      price_asc: (a,b)=> a.price - b.price,
      price_desc: (a,b)=> b.price - a.price,
      depart_asc: (a,b)=> a.departMinutes - b.departMinutes,
      duration_asc: (a,b)=> a.durationMinutes - b.durationMinutes
    }
    const cmp = cmpFuncs[sortBy]
    const directSorted = [...results.direct].sort(cmp)
    const combosSorted = [...results.combos].sort(cmp)
    return {direct: directSorted, combos: combosSorted}
  }, [results, sortBy])

  return (
    <div>
      <section className="bg-white p-6 rounded-2xl shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <StationSelect label="Source" stations={stations} value={source} onChange={setSource} exclude={destination} />
          <StationSelect label="Destination" stations={stations} value={destination} onChange={setDestination} exclude={source} />
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Max layover (hrs)</label>
            <input type="number" min="0" max="24" value={maxLayoverHours} onChange={e=>setMaxLayoverHours(Number(e.target.value))} className="border rounded px-3 py-2 w-24" />
          </div>
          <div className="flex gap-2">
            <button className="ml-auto bg-primary text-white px-4 py-2 rounded shadow hover:opacity-95" onClick={onSearch}>Search Trains</button>
            <button className="bg-white border px-4 py-2 rounded" onClick={()=>{setSource(''); setDestination(''); setResults({direct:[], combos:[]})}}>Reset</button>
          </div>
        </div>
        {error && <div className="mt-3 text-red-600">{error}</div>}
      </section>

      <section className="mt-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Results</h2>
        <SortControls sortBy={sortBy} setSortBy={setSortBy} />
      </section>

      {loading ? <Loader /> : (
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Direct Trains ({sortedResults.direct.length})</h3>
            <div className="space-y-3">
              {sortedResults.direct.length===0 && <div className="text-gray-500">No direct trains found.</div>}
              {sortedResults.direct.map(t=> <TrainCard key={t.id} train={t} />)}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Two-leg Combinations ({sortedResults.combos.length})</h3>
            <div className="space-y-3">
              {sortedResults.combos.length===0 && <div className="text-gray-500">No two-leg combos found.</div>}
              {sortedResults.combos.map((c,i)=> <ComboCard key={`${c.a.id}_${c.b.id}_${i}`} combo={c} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}