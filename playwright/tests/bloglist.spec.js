const { test, expect, beforeEach, describe } = require('@playwright/test')
import dotenv from 'dotenv'
const { loginWith } = require('./helper')
dotenv.config()

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
      await request.post('http://localhost:3003/api/testing/reset')
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Matti Luukkainen',
          username: 'mluukkai',
          password: 'salainen'
        }
      })
  
      await page.goto('http://localhost:5173')
    })
  
    test('Login form is shown', async ({ page }) => {
        const locator = await page.locator('h2', { hasText: 'Login' })
        await expect(locator).toBeVisible()
    })

    test('login success', async ({ page }) => {
        // await page.goto('http://localhost:5173')
        await loginWith(page, 'mluukkai', 'salainen')
        await expect(page.locator('div.success')).toBeVisible({ timeout: 5000 })
    })

    test('login error', async ({ page }) => {
        await loginWith(page, 'meni', 'väärin')
        await expect(page.locator('div.error')).toBeVisible({ timeout: 5000 })
        await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })


    test('a new blog can be created', async ({ page }) => {
        await loginWith(page, 'mluukkai', 'salainen')
        await expect(page.locator('div.success')).toBeVisible({ timeout: 5000 })

        const newBlogButton = await page.locator('button', { hasText: 'New Blog' })
        await expect(newBlogButton).toBeVisible()
        await newBlogButton.click()
        const textboxes = await page.getByRole('textbox').all()
        expect(textboxes.length).toBe(3)
    })

    test('blogs can be liked', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.locator('div.success')).toBeVisible({ timeout: 5000 })

      const viewButtons = await page.locator('button.togglableContent')
      const count = await viewButtons.count()
      const randomIndex = Math.floor(Math.random() * count)

      await viewButtons.nth(randomIndex).click()
      const blog = await page.locator('.blog').nth(randomIndex)
      await blog.getByRole('button', { name: 'Like' }).click()
      await blog.getByRole('button', { name: 'Hide' }).click()
      await expect(page.locator('div.success')).toBeVisible({ timeout: 5000 })

    })

    test('a blog is created and then deleted', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.locator('div.success', { hasText: 'logged in' })).toBeVisible()

      await page.getByRole('button', { name: 'New Blog' }).click()

      await page.getByLabel('Title:'). fill('Test Blog To Delete')
      await page.getByLabel('Author:'). fill('Test Author')
      await page.getByLabel('Url:'). fill('http://example.com')

      await page.getByRole('button', { name: 'Create' }).click()

      await expect(page.locator('div.success')).toBeVisible({ timeout: 5000 })

      const blog = page.locator('.blog', { hasText: 'Test Blog To Delete' })
      await blog.getByRole('button', { name: 'View' }).click()
    
      await blog.getByRole('button', { name: 'Delete' }).click()

      page.once('dialog', async dialog => await dialog.accept())
      await blog.getByRole('button', { name: 'Delete' }).click()
      await expect(page.locator('div.success', { hasText: 'Blog deleted successfully' }))
      .toBeVisible({ timeout: 5000 })
    })

    test('blogs are ordered by likes in descending order', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.locator('div.success', { hasText: 'logged in' })).toBeVisible()
    
      const viewButtons = await page.locator('button.togglableContent').all()
      for (const button of viewButtons) {
        await button.click()
      }
    
      await page.waitForTimeout(500)
    
      const likeElements = await page.locator('.oneblog >> text=likes:').allTextContents()
    
      const likes = likeElements.map(text => {
        const match = text.match(/likes:\s*(\d+)/)
        return match ? parseInt(match[1], 10) : 0
      })
    
      const sorted = [...likes].sort((a, b) => b - a)
      expect(likes).toEqual(sorted)
    })

})
