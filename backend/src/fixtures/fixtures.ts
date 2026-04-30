import mongoose from 'mongoose';
import config from '../config.ts';
import User from '../model/user/User.ts';

const fixtureImagesPath: string = `../fixtures/images`;

const run = async () => {
  await mongoose.connect(config.db);

  const db = mongoose.connection;

  try {
    await db.dropCollection('users');
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

  await mongoose.disconnect();
};

run().catch((error) => console.error(error));
