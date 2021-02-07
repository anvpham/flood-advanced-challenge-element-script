import { step, TestSettings, By, beforeAll, afterAll } from '@flood/element'

export const settings: TestSettings = {
	// userAgent: 'flood-chrome-test',
	// loopCount: 1,

	// Automatically wait for elements before trying to interact with them
	waitUntil: 'visible',
}

export default () => {
	beforeAll(async browser => {
		// Run this hook before running the first step
		await browser.wait('500ms')
	})

	afterAll(async browser => {
		// Run this hook after running the last step
		await browser.wait('500ms')
	})

	// If you want to do some actions before/after every single step, use beforeEach/afterEach
	// beforeEach(async browser => {})
	// afterEach(async browser => {})

	step('Start', async browser => {
		// visit instructs the browser to launch, open a page, and navigate to https://challenge.flood.io
		await browser.visit('https://challenge.flood.io')
	})

	// browser keyword can be shorthanded as anything that is descriptive to you.
	step('Click start button', async browser => {
		const startButton = await browser.findElement(By.attr('input', 'value', 'Start'))
		await startButton.click()
	})

	step('Choose my age', async browser => {
		const dropdownButton = await browser.findElement(By.id('challenger_age'))
		await dropdownButton.click()

		await browser.selectByValue(dropdownButton, '20')

		const nextButton = await browser.findElement(By.attr('input', 'value', 'Next'))
		await nextButton.click()
	})

	step('Enter and select largest order value', async browser => {
		const labels = await browser.findElements(By.tagName('label'))

		const orderValues = await Promise.all(labels.map(async label => parseInt(await label.text())))

		const maxValue = Math.max(...orderValues)

		const input = await browser.findElement(By.id('challenger_largest_order'))

		await input.type(maxValue.toString())

		const radioButton = await browser.findElement(By.visibleText(maxValue.toString()))
		await radioButton.click()

		const nextButton = await browser.findElement(By.attr('input', 'value', 'Next'))
		await nextButton.click()
	})

	step('Click next button', async browser => {
		const nextButton = await browser.findElement(By.attr('input', 'value', 'Next'))
		await nextButton.click()
	})

	step('Enter one time token', async browser => {
		const spanElement = await browser.findElement(By.attr('span', 'class', 'token'))
		const oneTimeToken = await spanElement.text()

		const input = await browser.findElement(By.id('challenger_one_time_token'))
		await input.type(oneTimeToken)

		const nextButton = await browser.findElement(By.attr('input', 'value', 'Next'))
		await nextButton.click()

		browser.wait(5000)
	})
}
