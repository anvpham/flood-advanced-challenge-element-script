import { step, TestSettings, By, beforeAll, afterAll } from '@flood/element'

export const settings: TestSettings = {
	waitUntil: 'visible',
	actionDelay: '500ms',
	stepDelay: '1s',
}

export default () => {
	let currentMinPrice = 0
	let currentMaxPrice = 0
	let areItemsEmpty = false

	beforeAll(async browser => {
		// Run this hook before running the first step
		await browser.wait('500ms')
	})

	afterAll(async browser => {
		// Run this hook after running the last step
		await browser.wait('500ms')
	})

	step('Visit the site', async browser => {
		await browser.visit('https://element-challenge.flood.io/')
	})

	step('Take the challenge', async browser => {
		const takeChallengeButton = await browser.findElement(By.visibleText('TAKE THE CHALLENGE'))
		await takeChallengeButton.click()
	})

	step('Challenge 1', async browser => {
		const h2Element = await browser.findElement(By.tagName('h2'))
		const text = await h2Element.text()

		const percent = text.split(' ')[3]

		const radioButton = await browser.findElement(
			By.id(`challenge-1-option-${percent.split('%')[0]}`),
		)
		await radioButton.click()

		const checkButton = await browser.findElement(By.visibleText('CHECK'))
		await checkButton.click()

		const nextButton = await browser.findElement(By.visibleText('NEXT'))
		await nextButton.click()
	})

	step('Challenge 2', async browser => {
		const category = await browser.findElement(By.id('challenge-2-category'))
		const categoryName = await category.text()
		const categoryButton = await browser.findElement(By.attr('button', 'value', categoryName))
		categoryButton.click()

		const items = await browser.findElements(By.attr('a', 'class', 'jss67'))

		const radioButton = await browser.findElement(
			By.id(`challenge-2-option-${items.length.toString()}`),
		)
		await radioButton.click()

		const checkButton = await browser.findElement(By.visibleText('CHECK'))
		await checkButton.click()

		const nextButton = await browser.findElement(By.visibleText('NEXT'))
		await nextButton.click()
	})

	step('Challenge 3', async browser => {
		const revealButton = await browser.findElement(
			By.attr(
				'button',
				'class',
				'MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary',
			),
		)
		revealButton.click()

		const h6Element = await browser.findElement(
			By.attr('h6', 'class', 'MuiTypography-root jss26 MuiTypography-h6'),
		)
		const code = (await h6Element.text()).split('"')[1]

		const input = await browser.findElement(By.id('challenge-3-promotion-code'))
		await input.type(code)

		const checkButton = await browser.findElement(By.visibleText('CHECK'))
		await checkButton.click()

		const nextButton = await browser.findElement(By.visibleText('NEXT'))
		await nextButton.click()
	})

	step('Challenge 4', async browser => {
		const productsButton = await browser.findElement(By.attr('a', 'href', '/products'))
		productsButton.click()

		const checkButton = await browser.findElement(By.visibleText('CHECK'))
		await checkButton.click()

		const nextButton = await browser.findElement(By.visibleText('NEXT'))
		await nextButton.click()
	})

	step('Challenge 5', async browser => {
		const minPriceText = await browser.findElement(By.id('challenge-5-min-price'))
		const minPriceValue = parseInt((await minPriceText.text()).split('$')[1])
		currentMinPrice = minPriceValue

		const maxPriceText = await browser.findElement(By.id('challenge-5-max-price'))
		const maxPriceValue = parseInt((await maxPriceText.text()).split('$')[1])
		currentMaxPrice = maxPriceValue

		const minSlider = await browser.findElement(By.attr('span', 'data-index', '0'))
		await minSlider.focus()
		const minSliderPromises: Promise<void>[] = []

		browser.evaluate(() => {
			const element = document.getElementsByClassName('jss67')
			if (element.length === 0) {
				areItemsEmpty = true
			}
		})

		for (let i = 0; i < minPriceValue - 50; i++) {
			minSliderPromises.push(browser.press('ArrowRight'))
		}

		await Promise.all(minSliderPromises)

		const maxSlider = await browser.findElement(By.attr('span', 'data-index', '1'))
		await maxSlider.focus()
		const maxSliderPromises: Promise<void>[] = []

		for (let i = 0; i < 2000 - maxPriceValue; i++) {
			maxSliderPromises.push(browser.press('ArrowLeft'))
		}

		await Promise.all(maxSliderPromises)

		let itemCount = 0
		const pageCount = (await browser.findElements(By.tagName('li'))).length - 2

		if (!areItemsEmpty) {
			if (pageCount === 0) {
				itemCount = (await browser.findElements(By.attr('a', 'class', 'jss67'))).length
			} else {
				const lastPageButton = await browser.findElement(
					By.attr('button', 'aria-label', `Go to page ${pageCount}`),
				)
				await lastPageButton.click()

				itemCount = (await browser.findElements(By.attr('a', 'class', 'jss67'))).length
				itemCount += (pageCount - 1) * 18
			}
		}

		const input = await browser.findElement(By.id('challenge-5-amount-products'))
		await input.type(itemCount.toString())

		const checkButton = await browser.findElement(By.visibleText('CHECK'))
		await checkButton.click()

		const nextButton = await browser.findElement(By.visibleText('NEXT'))
		await nextButton.click()
	})

	step('Challenge 6', async browser => {
		if (!areItemsEmpty) {
			const pageCount = (await browser.findElements(By.tagName('li'))).length - 2

			const itemsOnCurrentPage = await browser.findElements(By.attr('a', 'class', 'jss67'))

			for (let i = 0; i < itemsOnCurrentPage.length; i++) {
				await browser.scrollTo(itemsOnCurrentPage[i])

				const location = await itemsOnCurrentPage[i].centerPoint()
				await browser.mouse.move(location[0], location[1])

				const openAddToCartButton = await browser.findElement(By.css('.MuiCollapse-entered'))
				await openAddToCartButton.click()

				const addToCartButton = await browser.findElement(
					By.attr('button', 'data-test-add-to-cart', 'true'),
				)
				await addToCartButton.click()

				const closeButton = await browser.findElement(
					By.attr('button', 'data-test-product-detail-modal-close', 'true'),
				)
				await closeButton.click()
			}

			if (pageCount !== 0) {
				const page1Button = await browser.findElement(
					By.attr('button', 'aria-label', 'Go to page 1'),
				)

				await page1Button.click()

				const nextPageButton = await browser.findElement(
					By.attr('button', 'aria-label', 'Go to next page'),
				)

				for (let i = 0; i < pageCount - 1; i++) {
					const itemsOnCurrentPage = await browser.findElements(By.attr('a', 'class', 'jss67'))

					for (let i = 0; i < itemsOnCurrentPage.length; i++) {
						await browser.scrollTo(itemsOnCurrentPage[i])

						const location = await itemsOnCurrentPage[i].centerPoint()
						await browser.mouse.move(location[0], location[1])

						const openAddToCartButton = await browser.findElement(By.css('.MuiCollapse-entered'))
						await openAddToCartButton.click()

						const addToCartButton = await browser.findElement(
							By.attr('button', 'data-test-add-to-cart', 'true'),
						)
						await addToCartButton.click()

						const closeButton = await browser.findElement(
							By.attr('button', 'data-test-product-detail-modal-close', 'true'),
						)
						await closeButton.click()
					}

					await nextPageButton.click()
				}
			}
		}

		const checkButton = await browser.findElement(By.visibleText('CHECK'))
		await checkButton.click()

		const nextButton = await browser.findElement(By.visibleText('NEXT'))
		await nextButton.click()
	})

	step('Challenge 7', async browser => {
		const category = await (
			await browser.findElement(By.attr('span', 'data-test-category', 'true'))
		).text()

		const size = await (await browser.findElement(By.attr('span', 'data-test-size', 'true'))).text()

		const minPrice = parseInt(
			await (await browser.findElement(By.id('challenge-7-min-price'))).text(),
		)

		const maxPrice = parseInt(
			await (await browser.findElement(By.id('challenge-7-max-price'))).text(),
		)

		const categoryCheckBox = await browser.findElement(By.attr('input', 'name', category))
		await categoryCheckBox.click()

		const sizeCheckBox = await browser.findElement(By.attr('input', 'name', size))
		await sizeCheckBox.click()

		const minSlider = await browser.findElement(By.attr('span', 'data-index', '0'))
		await minSlider.focus()
		const minSliderPromises: Promise<void>[] = []

		if (minPrice > currentMinPrice) {
			for (let i = 0; i < minPrice - currentMinPrice; i++) {
				minSliderPromises.push(browser.press('ArrowRight'))
			}
		} else {
			for (let i = 0; i < currentMinPrice - minPrice; i++) {
				minSliderPromises.push(browser.press('ArrowLeft'))
			}
		}

		await Promise.all(minSliderPromises)

		let maxSlider
		if (minPrice > currentMaxPrice) {
			maxSlider = await browser.findElement(
				By.attr('span', 'aria-valuenow', currentMaxPrice.toString()),
			)
		} else {
			maxSlider = await browser.findElement(By.attr('span', 'data-index', '1'))
		}
		await maxSlider.focus()
		const maxSliderPromises: Promise<void>[] = []

		if (maxPrice > currentMaxPrice) {
			for (let i = 0; i < maxPrice - currentMaxPrice; i++) {
				maxSliderPromises.push(browser.press('ArrowRight'))
			}
		} else {
			for (let i = 0; i < currentMaxPrice - maxPrice; i++) {
				maxSliderPromises.push(browser.press('ArrowLeft'))
			}
		}

		await Promise.all(maxSliderPromises)

		const checkButton = await browser.findElement(By.visibleText('CHECK'))
		await checkButton.click()

		const nextButton = await browser.findElement(By.visibleText('NEXT'))
		await nextButton.click()
	})

	step('Challenge 8', async browser => {
		const cartButton = await browser.findElement(By.id('cart-button'))
		await cartButton.click()

		const minPrice = parseInt(
			(await (await browser.findElement(By.id('challenge-8-min-price'))).text()).split('$')[1],
		)

		const maxPrice = parseInt(
			(await (await browser.findElement(By.id('challenge-8-max-price'))).text()).split('$')[1],
		)

		let totalPrice = parseInt(
			(await (await browser.findElement(By.id('subtotal-price'))).text()).split('$')[1],
		)

		if (totalPrice <= maxPrice && totalPrice >= minPrice) {
			const checkButton = await browser.findElement(By.visibleText('CHECK'))
			await checkButton.click()

			const nextButton = await browser.findElement(By.visibleText('NEXT'))
			await nextButton.click()
		} else {
			if (totalPrice < minPrice) {
				const addButton = await browser.findElement(By.attr('button', 'data-test-add', 'true'))
				const firstItemPrice = parseInt(
					(
						await (
							await browser.findElement(By.attr('h6', 'data-test-purchase-price', 'true'))
						).text()
					).split('$')[1],
				)

				while (totalPrice < minPrice) {
					await addButton.click()
					totalPrice += firstItemPrice
				}
			} else {
				const removeButtons = await browser.findElements(
					By.attr('button', 'data-test-remove', 'true'),
				)

				const itemsPrice = await browser.findElements(
					By.attr('h6', 'data-test-purchase-price', 'true'),
				)

				for (let i = 0; i < removeButtons.length; i++) {
					await removeButtons[i].click()
					totalPrice -= parseInt(await (await itemsPrice[i].text()).split('$')[1])

					if (totalPrice < maxPrice) break
				}
			}
		}

		const checkButton = await browser.findElement(By.visibleText('CHECK'))
		await checkButton.click()

		const nextButton = await browser.findElement(By.visibleText('NEXT'))
		await nextButton.click()
	})
}
