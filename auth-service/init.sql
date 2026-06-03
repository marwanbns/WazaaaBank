CREATE TABLE IF NOT EXISTS users (
    account_number VARCHAR(20) PRIMARY KEY,
    pseudo VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    profile_image TEXT DEFAULT 'default.jpg'
);

INSERT INTO users (account_number, pseudo, password, profile_image) VALUES ('12345', 'admin', 'admin', 'admin.jpg') ON CONFLICT (pseudo) DO NOTHING;
INSERT INTO users (account_number, pseudo, password, profile_image) VALUES ('00000', 'test', 'test', 'test.jpg') ON CONFLICT (pseudo) DO NOTHING;
INSERT INTO users (account_number, pseudo, password, profile_image) VALUES ('24040', 'marwan', 'marwan', 'marwan.jpg') ON CONFLICT (pseudo) DO NOTHING;
INSERT INTO users (account_number, pseudo, password, profile_image) VALUES ('06090', 'edouard', 'edouard', 'edouard.jpg') ON CONFLICT (pseudo) DO NOTHING;
INSERT INTO users (account_number, pseudo, password, profile_image) VALUES ('12040', 'ali', 'ali', 'ali.jpg') ON CONFLICT (pseudo) DO NOTHING;
INSERT INTO users (account_number, pseudo, password, profile_image) VALUES ('11111', 'test1', 'test1', 'default.jpg') ON CONFLICT (pseudo) DO NOTHING;
INSERT INTO users (account_number, pseudo, password, profile_image) VALUES ('22222', 'test2', 'test2', 'default.jpg') ON CONFLICT (pseudo) DO NOTHING;
INSERT INTO users (account_number, pseudo, password, profile_image) VALUES ('73944', 'james', 'blonde', 'default.jpg') ON CONFLICT (pseudo) DO NOTHING;
INSERT INTO users (account_number, pseudo, password, profile_image) VALUES ('47450', 'dabobo', 'dabobi', 'default.jpg') ON CONFLICT (pseudo) DO NOTHING;
INSERT INTO users (account_number, pseudo, password, profile_image) VALUES ('51829', 'test45', 'test45', 'default.jpg') ON CONFLICT (pseudo) DO NOTHING;
INSERT INTO users (account_number, pseudo, password, profile_image) VALUES ('33230', 'Atlasss', 'Test123', 'default.jpg') ON CONFLICT (pseudo) DO NOTHING;
INSERT INTO users (account_number, pseudo, password, profile_image) VALUES ('54357', 'ahhh', 'ahhh', 'default.jpg') ON CONFLICT (pseudo) DO NOTHING;
INSERT INTO users (account_number, pseudo, password, profile_image) VALUES ('93206', 'fhh', 'fhh', 'default.jpg') ON CONFLICT (pseudo) DO NOTHING;
INSERT INTO users (account_number, pseudo, password, profile_image) VALUES ('1000000013', 'newuser', 'newuser', 'default.jpg') ON CONFLICT (pseudo) DO NOTHING;
INSERT INTO users (account_number, pseudo, password, profile_image) VALUES ('1000000014', 'testuser', 'testuser', 'default.jpg') ON CONFLICT (pseudo) DO NOTHING;
INSERT INTO users (account_number, pseudo, password, profile_image) VALUES ('1000000015', 'oooo', 'oooo', 'default.jpg') ON CONFLICT (pseudo) DO NOTHING;
INSERT INTO users (account_number, pseudo, password, profile_image) VALUES ('1000000016', 'ko', 'ko', 'default.jpg') ON CONFLICT (pseudo) DO NOTHING;