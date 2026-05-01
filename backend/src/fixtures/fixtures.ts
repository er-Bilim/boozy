import mongoose from 'mongoose';
import config from '../config.ts';
import User from '../model/user/User.ts';
import Cocktail from '../model/cocktail/Cocktail.ts';

const fixtureImagesPath: string = `../fixtures/images`;

const run = async () => {
  await mongoose.connect(config.db);

  const db = mongoose.connection;

  try {
    await db.dropCollection('users');
    await db.dropCollection('cocktails');
  } catch (error) {
    console.error(error);
  }

  const [admin, bobr] = await User.create([
    {
      email: 'admin@gmail.com',
      displayName: 'admin',
      avatar: `${fixtureImagesPath}/beaver.png`,
      password: 'admin',
      role: 'admin',
    },
    {
      email: 'bobr@gmail.com',
      displayName: 'bobr',
      avatar: `${fixtureImagesPath}/gorilla.png`,
      password: 'bobr123',
    },
  ]);

  admin!.generateRefreshToken();
  await admin!.save();
  bobr!.generateRefreshToken();
  await bobr!.save();

  await Cocktail.create([
    {
      user: admin!._id,
      title: 'margarita',
      recipe:
        'Shake all the ingredients in a shaker with ice. Strain into a glass with a salted rim.',
      image: `${fixtureImagesPath}/margarita.png`,
      ingredients: [
        { name: 'Tequila', amount: '50 ml' },
        { name: 'Lime juice', amount: '25 ml' },
        { name: 'Triple S', amount: '20 ml' },
      ],
      isPublished: true,
    },
    {
      user: bobr!._id,
      title: 'old fashioned',
      recipe:
        'Put the sugar in a glass, add the bitters and water. Stir until dissolved. Add ice and bourbon.',
      image: `${fixtureImagesPath}/old_fashion.png`,
      ingredients: [
        { name: 'bourbon', amount: '45 ml' },
        { name: 'Angostura Bitters', amount: '2 desh' },
        { name: 'Тростниковый сахар', amount: '1 cube' },
        { name: 'Water', amount: 'a few drops' },
      ],
      isPublished: true,
    },
  ]);

  await mongoose.disconnect();
};

run().catch((error) => console.error(error));
