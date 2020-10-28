import { Text } from 'components/atoms'
import * as React from 'react'
import { ComposedChart, Line, ResponsiveContainer, Tooltip, YAxis } from 'recharts'

export interface PriceChartDataPoint {
  date: string
  usdPrice: number
  btcPrice: number
}

interface Props {
  data: PriceChartDataPoint[]
}

export default ({ data }: Props) => (
  <ResponsiveContainer width="100%" height={150}>
    <ComposedChart data={data} margin={{ top: 5, bottom: 5 }}>
      <defs>
        <linearGradient id="colorLux" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#2074ee" stopOpacity={0.8} />
          <stop offset="95%" stopColor="##2074ee" stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* <XAxis dataKey="date" /> */}
      {/* <YAxis /> */}
      {/* <CartesianGrid strokeDasharray="3 3" /> */}
      <Tooltip
        labelFormatter={(i: number) => {
          return <Text>{data[i].date}</Text>
        }}
        // formatter={(value, name, props) => {
        //   console.log('hi', value, name, props)
        //   return 'hi'
        // }}
      />
      {/* <Legend /> */}
      <YAxis scale="auto" domain={['dataMin', 'dataMax']} hide={true} yAxisId={0} />
      <YAxis scale="auto" hide={true} domain={['dataMin', 'dataMax']} yAxisId={1} />
      <Line
        type="monotone"
        fillOpacity={1}
        dataKey="btcPrice"
        stroke="#FDCA0B"
        // strokeWidth={2}
        yAxisId={0}

        // fill="url(#colorLux)"
      />
      <Line
        type="monotone"
        fillOpacity={1}
        dataKey="usdPrice"
        stroke="#2074ee"
        // strokeWidth={2}
        yAxisId={1}
        // fill="url(#colorLux)"
      />
      {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
    </ComposedChart>
  </ResponsiveContainer>
)
