export interface ValidationError {
  field: string
  message: string
}

export const validateDocumentType = (type: string): ValidationError | null => {
  const validTypes = ["Contract", "Proposal", "Agreement", "Invoice", "Report", "Letter"]

  if (!type) {
    return { field: "documentType", message: "Document type is required" }
  }

  if (!validTypes.includes(type)) {
    return { field: "documentType", message: "Invalid document type" }
  }

  return null
}

export const validateTitle = (title: string): ValidationError | null => {
  if (!title) {
    return { field: "title", message: "Title is required" }
  }

  if (title.length < 3) {
    return { field: "title", message: "Title must be at least 3 characters" }
  }

  if (title.length > 255) {
    return { field: "title", message: "Title must be less than 255 characters" }
  }

  return null
}

export const validateSection = (heading: string, content: string, index: number): ValidationError[] => {
  const errors: ValidationError[] = []

  if (!heading) {
    errors.push({
      field: `section_${index}_heading`,
      message: "Section heading is required",
    })
  }

  if (!content) {
    errors.push({
      field: `section_${index}_content`,
      message: "Section content is required",
    })
  }

  if (heading.length > 200) {
    errors.push({
      field: `section_${index}_heading`,
      message: "Heading must be less than 200 characters",
    })
  }

  return errors
}

export const validateAuthor = (author: string): ValidationError | null => {
  if (!author || author.length < 2) {
    return { field: "author", message: "Author name is required" }
  }

  if (author.length > 100) {
    return { field: "author", message: "Author name must be less than 100 characters" }
  }

  return null
}
