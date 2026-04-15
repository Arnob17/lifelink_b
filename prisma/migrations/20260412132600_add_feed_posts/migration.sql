-- CreateTable
CREATE TABLE `feed_posts` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(200) NULL,
    `content` TEXT NOT NULL,
    `author_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `feed_posts_author_id_idx`(`author_id`),
    INDEX `feed_posts_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `feed_posts` ADD CONSTRAINT `feed_posts_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
