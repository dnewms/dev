/**
 * Seed script to populate the database with common disposable email domains
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Common disposable email domains
const DISPOSABLE_DOMAINS = [
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'maildrop.cc',
  'temp-mail.org',
  'throwaway.email',
  'yopmail.com',
  'tempmail.com',
  'getnada.com',
  'fakeinbox.com',
  'dispostable.com',
  'trashmail.com',
  'mohmal.com',
  'emailondeck.com',
  'guerrillamailblock.com',
  'sharklasers.com',
  'grr.la',
  'spam4.me',
  'mintemail.com',
  'temp-mail.io',
  'burnermail.io',
  'emailsensei.com',
  'mailnesia.com',
  'tempinbox.com',
  'mytemp.email',
  'throwawaymail.com',
  'mailcatch.com',
  'deadaddress.com',
  'mailexpire.com',
  'tempr.email',
  'fakemail.net',
  'disposablemail.com',
  'spamgourmet.com',
  '33mail.com',
  'mailsac.com',
  'sneakemail.com',
  'spam.la',
  'incognitomail.com',
  'anonymbox.com',
  'tmail.com',
  'tempmail.net',
  'mailforspam.com',
  'tmpeml.info',
  'spambog.com',
  'emailtemporanea.net',
  'eyepaste.com',
  'crazymailing.com',
  'mailzilla.com',
  'mt2014.com',
  'mt2015.com',
  'trashmail.net',
];

async function main() {
  console.log('Starting to seed disposable domains...');

  const existingDomains = await prisma.disposableDomain.findMany({
    select: { domain: true },
  });

  const existingDomainsSet = new Set(existingDomains.map(d => d.domain));

  // Filter out domains that already exist
  const domainsToAdd = DISPOSABLE_DOMAINS.filter(
    domain => !existingDomainsSet.has(domain)
  );

  if (domainsToAdd.length === 0) {
    console.log('All domains already exist in the database.');
    return;
  }

  console.log(`Adding ${domainsToAdd.length} new disposable domains...`);

  await prisma.disposableDomain.createMany({
    data: domainsToAdd.map(domain => ({ domain })),
    skipDuplicates: true,
  });

  console.log(`Successfully added ${domainsToAdd.length} disposable domains!`);

  const totalCount = await prisma.disposableDomain.count();
  console.log(`Total disposable domains in database: ${totalCount}`);
}

main()
  .catch((e) => {
    console.error('Error seeding disposable domains:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
