import * as yup from "yup";

// NEW CASE SCHEMA
const CaseAddressesDefactoSchema = yup.object().shape({
  apartment: yup.string(),
  buildingNumber: yup.string(),
  city: yup.string()
    .max(30, "Максимум 30 символов"),
  street: yup.string()
    .max(30, "Максимум 30 символов"),
  number: yup.string()
    .max(10, "Максимум 10 символов"),
  region: yup.string()
    .max(30, "Максимум 30 символов"),
});

const CaseAddressesResidenceSchema = yup.object().shape({
  apartment: yup.string(),
  buildingNumber: yup.string(),
  city: yup.string()
    .required("Город обязателен")
    .min(3, "Минимум 3 символа")
    .max(30, "Максимум 30 символов"),
  street: yup.string()
    .required("Улица обязательна")
    .min(3, "Минимум 3 символа")
    .max(30, "Максимум 30 символов"),
  number: yup.string()
    .required("Номер улицы обязателен")
    .min(1, "Минимум 1 символ")
    .max(10, "Максимум 10 символов"),
  region: yup.string()
    .required("Район обязателен")
    .min(3, "Минимум 3 символа")
    .max(30, "Максимум 30 символов"),
});

const CaseAddressesSchema = yup.object().shape({
  defacto: CaseAddressesDefactoSchema,
  residence: CaseAddressesResidenceSchema,
});

const CaseContactDataSchema = yup.object().shape({
  mainNumber: yup.string()
    .required("Телефон обязателен")
    .min(9, "Минимум 9 символов")
    .max(11, "Максимум 11 символов"),
  email: yup.string().email("Некорректный адрес электронной почты" ),
});

const CaseIdentificationBulletinSchema = yup.object().shape({
  idnp: yup.number()
    .typeError("IDNP должен состоять только из цифр")
    .required("IDNP обязателен")
    .test('13ch', "IDNP должен состоять 13 цифр", val => val.toString().length === 13),
  series: yup.string()
    .required("Серия обязательна")
    .test('9ch', 'Серия должна состоять 9 цифр', val => val.toString().length === 9),
  issuedAt: yup.string()
    .required('Дата выдачи обязательна')
    .test('10ch', 'Дата выдачи должна состоять из 10 символов', val => val.toString().length === 10),
  expiration: yup.string()
    .required('Срок действия обязателен')
    .test('10ch', 'Срок действия должен состоять из 10 символов', val => val.toString().length === 10),
  issuedBy: yup.string()
    .max(30, 'Максимум 30 символов'),
});

const CaseIdentificationSchema = yup.object().shape({
  bulletin: CaseIdentificationBulletinSchema.required(),
});

const CasePersonalDataSchema = yup.object().shape({
  birthDate: yup.string()
    .required("Дата рождения обязательна")
    .test('10ch', 'Дата рождения должна состоять из 10 символов', val => val.toString().length === 10),
  firstName: yup.string()
    .required('Имя обязательно')
    .min(2, 'Минимум 2 символа')
    .max(20, 'Максимум 20 символов'),
  lastName: yup.string()
    .required('Фамилия обязательна')
    .min(2, 'Минимум 2 символа')
    .max(20, 'Максимум 20 символов'),
});

const CaseCreditSchema = yup.object().shape({
  id: yup.number()
    .typeError("ID должен состоять только из цифр")
    .required('ID обязателен')
    .test('7ch', 'ID должен состоять из 7 цифр', val => val.toString().length === 7),
  amount: yup.number()
    .typeError('Сумма кредита должна состоять только из цифр')
    .required('Сумма кредита обязательна')
    .min(1000, 'Минимум 1000'),
  issuedDate: yup.string()
    .required('Дата контракта обязательна')
    .test('10ch', 'Дата контракта должна состоять из 10 символов', val => val.toString().length === 10),
})

export const NewCaseSchema = yup.object().shape({
  addresses: CaseAddressesSchema,
  contactData: CaseContactDataSchema,
  identification: CaseIdentificationSchema,
  personalData: CasePersonalDataSchema,
  credit: CaseCreditSchema,
});
// END NEW CASE SCHEMA