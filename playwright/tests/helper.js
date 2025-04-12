const loginWith = async (page, username, password)  => {
    // console.log(username, password)
    // await page.getByRole('button', { name: 'log in' }).click()
    const textboxes = await page.getByRole('textbox').all()
    await textboxes[0].fill(username)
    await textboxes[1].fill(password)
    await page.locator('button[type="submit"]').click()
  }
  
  export { loginWith }