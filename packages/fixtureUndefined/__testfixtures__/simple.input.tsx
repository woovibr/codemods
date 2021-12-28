export const createFixture = async (
  args: DeepPartial<IFixture> = {},
) => {
  const n = getCounter('pixTransaction');

  const {
    company,
    customer,
    ...rest
  } = args;

  if (!company) {
    company = await getOrCreate(Company, createCompany);
  }

  if (customer === null) {
    customer = await getOrCreate(Customer, createCustomer);
  }

  return new Fixture({
    company,
    customer,
    ...rest
  })
}
