-- CreateTable
CREATE TABLE `ps_registrations` (
    `id` VARCHAR(255) NOT NULL,
    `transport` VARCHAR(40) NULL,
    `outbound_auth` VARCHAR(255) NULL,
    `contact_user` VARCHAR(80) NULL,
    `client_uri` VARCHAR(255) NULL,
    `server_uri` VARCHAR(255) NULL,
    `retry_interval` INTEGER NULL,
    `expiration` INTEGER NULL,
    `forbidden_retry_interval` INTEGER NULL,
    `max_retries` INTEGER NULL,
    `endpoint` VARCHAR(40) NULL,

    UNIQUE INDEX `id`(`id`),
    INDEX `ps_registrations_id`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
