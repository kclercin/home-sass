import './App.css'
import { Card, DateTime, WorkTimer, AnniversarryTimer, ChristmasTimer, Horoscope, Weather, QuoteOfTheDay } from './components'

function App() {

  return (
    <div className="py-8">
      <div className="px-8">
        <h1 className="white">Bonjour Sarah...</h1>
          <div className="grid grid-cols-24 xs:grid-cols-1 gap-4">
            <div className="col-span-6 flex gap-4 flex-col">
              <div className="flex">
                <Card level="lg">
                  <DateTime />
                </Card>
              </div>
              <div className="flex">
                <Card level="lg">
                  <WorkTimer />
                </Card>
              </div>
              <div className="flex">
                <Card level="lg">
                  <AnniversarryTimer />
                </Card>
              </div>
              <div className="flex">
                <Card level="lg">
                  <ChristmasTimer />
                </Card>
              </div>
            </div>
            <div className="col-span-8">
              <div className="flex gap-4 flex-col">
                <div className="flex">
                  <Card level="lg">
                    <Horoscope />
                  </Card>
                </div>
                <div className="flex">
                  <Card level="lg">
                    <Weather />
                  </Card>
                </div>
              </div>
            </div>
            <div className="col-span-10">
              <div className="flex">
                <QuoteOfTheDay />
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}

export default App
