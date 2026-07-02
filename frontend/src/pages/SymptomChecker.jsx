import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { symptomService } from '../services/symptomService'
import DashCard, { LoadingSpinner } from '../components/dashboard/DashCard'

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState({})
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [textInput, setTextInput] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  useEffect(() => {
    const loadSymptoms = async () => {
      try {
        const data = await symptomService.getSymptomsGroupedByCategory()
        setSymptoms(data)
      } catch {
        toast.error('Failed to load symptoms')
      } finally {
        setCategoriesLoading(false)
      }
    }
    loadSymptoms()
  }, [])

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    )
  }

  const handleCheck = async (e) => {
    e.preventDefault()
    if (selectedSymptoms.length === 0) {
      toast.error('Please select at least one symptom')
      return
    }

    setLoading(true)
    try {
      const data = await symptomService.checkSymptoms({ selectedSymptoms, textInput })
      setResults(data.results)
      toast.success('Symptoms analyzed successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Symptom Checker</h2>
        <p className="text-gray-500 text-sm mt-1">Select your symptoms to get personalized disease insights</p>
      </div>

      <form onSubmit={handleCheck} className="space-y-6">
        <DashCard className="p-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Select Your Symptoms</h3>
          {categoriesLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-5">
              {Object.entries(symptoms).map(([category, syms]) => (
                <div key={category}>
                  <h4 className="font-semibold text-sm text-indigo-600 mb-2">{category}</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {syms.map((symptom) => (
                      <label
                        key={symptom._id}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition text-sm ${
                          selectedSymptoms.includes(symptom.name)
                            ? 'border-indigo-300 bg-indigo-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSymptoms.includes(symptom.name)}
                          onChange={() => handleSymptomToggle(symptom.name)}
                          className="w-4 h-4 accent-indigo-600"
                        />
                        <span className="text-gray-700">{symptom.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashCard>

        <DashCard className="p-6">
          <h3 className="text-base font-semibold text-gray-800 mb-3">Additional Information</h3>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Describe your symptoms in detail (optional)..."
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
            rows="4"
          />
        </DashCard>

        {selectedSymptoms.length > 0 && (
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <p className="text-xs font-semibold text-indigo-700 mb-2">
              Selected Symptoms ({selectedSymptoms.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map((symptom) => (
                <span key={symptom} className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs">
                  {symptom}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 text-sm shadow-md shadow-indigo-200"
        >
          {loading ? 'Analyzing...' : 'Check Symptoms'}
        </button>
      </form>

      {results && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Analysis Results</h3>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
            <p className="text-xs font-semibold text-amber-700 mb-1">DISCLAIMER</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              This analysis is for informational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment.
            </p>
          </div>

          {results.map((disease, idx) => (
            <DashCard key={disease.diseaseId} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-bold text-gray-800">{idx + 1}. {disease.name}</h4>
                <span className={`px-3 py-1 rounded-full text-white font-semibold text-xs ${
                  disease.severity === 'critical' ? 'bg-red-500' :
                  disease.severity === 'high' ? 'bg-amber-500' :
                  disease.severity === 'medium' ? 'bg-cyan-500' : 'bg-emerald-500'
                }`}>
                  {disease.severity.toUpperCase()}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex justify-between mb-1.5 text-sm">
                  <span className="font-medium text-gray-600">Match Probability</span>
                  <span className="font-bold text-indigo-600">{disease.probability}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all ${
                      disease.probability >= 70 ? 'bg-red-500' :
                      disease.probability >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${disease.probability}%` }}
                  />
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{disease.description}</p>

              {disease.emergencyWarning && (
                <div className="bg-red-50 p-3 rounded-lg mb-4 border border-red-100">
                  <p className="text-red-600 font-semibold text-xs">Emergency Warning</p>
                  <p className="text-xs text-gray-600 mt-1">{disease.emergencyWarning}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                {disease.doctorType && (
                  <div>
                    <p className="font-semibold text-gray-700 mb-1 text-xs">Recommended Doctor</p>
                    <p className="text-gray-500 text-xs">{disease.doctorType.join(', ')}</p>
                  </div>
                )}
                {disease.tests?.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-700 mb-1 text-xs">Suggested Tests</p>
                    <ul className="text-gray-500 text-xs list-disc list-inside">
                      {disease.tests.map((test) => <li key={test}>{test}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </DashCard>
          ))}
        </div>
      )}
    </div>
  )
}
