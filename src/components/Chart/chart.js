import React from 'react';

import {AreaChart,
				Area,
				XAxis,
				YAxis,
				CartesianGrid,
				Tooltip,
				RadialBarChart,
				RadialBar,
				Legend,
				LineChart,
				Line} from 'recharts';


export default class Charts extends React.Component {
	render () {

		var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
		const noteFormatter = (note) => noteStrings[note%12];
  	return (
    	<div>

				<LineChart width={600} height={400} data={this.props.notes}>
       		<XAxis name={this.props.notes.time/100} dataKey="time" padding={{left: 30, right: 30}}/>
       		<YAxis />
       		<CartesianGrid strokeDasharray="3 3"/>
       		<Tooltip />
       		<Legend />
       		<Line type="monotone" name="pitch" dataKey="note" stroke="#8884d8" activeDot={{r: 8}}/>
      	</LineChart>

      </div>
    );
  }
}
