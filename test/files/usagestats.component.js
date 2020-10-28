import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import UsageStats from '../../plugins/Files/js/components/usagestats.js'

describe('files usage stats component', () => {
	it('displays a spending bar with four sub-bars', () => {
		const component = shallow(<UsageStats allowance={100} downloadspending={10} uploadspending={10} storagespending={10} contractspending={10} unspent={10} renewheight={16000} />)
		expect(component.find('.spending-bar')).to.have.length(1)
		expect(component.find('.spending-bar').children()).to.have.length(4)
	})
})
