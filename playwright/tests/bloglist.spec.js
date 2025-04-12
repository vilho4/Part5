const { test, expect, beforeEach, describe } = require('@playwright/test')
import dotenv from 'dotenv'
const { loginWith } = require('./helper')
dotenv.config()


const aitousername = process.env.PLAYWRIGHT_USERNAME
const aitopassword = process.env.PLAYWRIGHT_PASSWORD


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

  })

// describe('Bloglist app', () => {
//     test('front page can be opened', async ({ page }) => {
//       await page.goto('http://localhost:5173')
  
//       const locator = await page.locator('h2', { hasText: 'Login' })
//       await expect(locator).toBeVisible()
//     //   await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2024')).toBeVisible()
//     })

//     test('login success', async ({ page }) => {
//         await page.goto('http://localhost:5173')
//         const textboxes = await page.getByRole('textbox').all()
//         await textboxes[0].fill(username)
//         await textboxes[1].fill(password)    
//         await page.locator('button[type="submit"]').click()
//         await expect(page.locator('div.success')).toBeVisible({ timeout: 5000 })
//     } )

//     test('login error', async ({ page }) => {
//         await page.goto('http://localhost:5173')
//         const textboxes = await page.getByRole('textbox').all()
//         await textboxes[0].fill('Teppo testaaja')
//         await textboxes[1].fill('Teppo')    
//         await page.locator('button[type="submit"]').click()
//         await expect(page.locator('div.error')).toBeVisible({ timeout: 5000 });
//     } )
// })

// describe('When logged in', () => {
//     beforeEach(async ({ page }) => {
//         await page.goto('http://localhost:5173')
//         const textboxes = await page.getByRole('textbox').all()
//         await textboxes[0].fill(username)
//         await textboxes[1].fill(password)    
//         await page.locator('button[type="submit"]').click()
//         await expect(page.locator('div.success')).toBeVisible({ timeout: 5000 })
//     })
  
//     test('a new blog can be created', async ({ page }) => {
//         await page.locator('button[type="submit"]').click()
//         const textboxes = await page.getByRole('textbox').all()
//         await textboxes[0].fill('playwright blog')
//         await textboxes[1].fill('playwright author')
//         await textboxes[2].fill('www.example.com')
//     })
//   })
