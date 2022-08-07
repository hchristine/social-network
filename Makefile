build:
	@PORT=3000 JWT_SECRET=knasbdfjhawsbsadv DB_URI=postgres://christy:fbpass@0.0.0.0:5432/facebook_clone CLOUDINARY_CLOUD_NAME=dhtzy18pv CLOUDINARY_API_KEY=787331694111768 CLOUDINARY_API_SECRET=eqmU5_B911FBTUaReQJ8hdKsW8g yarn dev

start_docker:
	@docker compose up -d

stop_docker:
	@docker compose down

start: start_docker build
