# DocGen

This is a simple Word documents (.docx) generator.
Simply create your template .docx file, place it in the public folder, customize the
form fields inside the root page.js and generative function in lib/generateDocument.js, and you're good to go!

## Getting Started:

```bash
git clone git@github:v3sker/docgen #clone the repo

cd docgen #change directory to the project folder

npm install #install dependencies

npm run dev #if you did everything good - you dev server is up!
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the project.

You can start editing the form by modifying `components/NewCaseForm.jsx`.

This project uses [`yup`](https://nextjs.org/docs/basic-features/font-optimization) schemas to validate the form, so also check `lib/schemas.js`, and change them accordingly
to your new form.

After, go to `lib/generateDocument.js`, and take a look at my document generation template.

## Learn More

You can learn about different variables, methods, and simply everything about templating your .docx file
on the official docxtemplater website: https://docxtemplater.com/docs/get-started-browser.

