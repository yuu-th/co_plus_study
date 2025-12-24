-- ADR-005: Seed Data
-- Initial data for badge definitions and system setup

-- ============================================================================
-- BADGE DEFINITIONS
-- ============================================================================

INSERT INTO badge_definitions (id, name, description, condition_description, rank, category, condition_logic, sort_order) VALUES
    -- 初心者・初回系
    ('first_post', '初心者', '学習の第一歩を踏み出した', '初回日報投稿', 'bronze', 'その他', 'total_posts:1', 10),
    ('first_week', 'チャレンジャー', '新しいことに挑戦している', '新しい教科の学習を開始', 'bronze', 'その他', 'unique_subjects:2', 15),
    
    -- 継続系（連続日数）
    ('streak_7', 'まじめさ', '毎日コツコツと学習を続けている証', '7日間連続で日報投稿', 'silver', '継続', 'streak_days:7', 20),
    ('streak_30', '継続力', '学習を習慣化できている', '30日間連続で日報投稿', 'gold', '継続', 'streak_days:30', 30),
    ('streak_60', '鉄の意志', '2ヶ月間毎日学習を継続', '60日間連続で日報投稿', 'gold', '継続', 'streak_days:60', 35),
    ('streak_365', 'マスター', '圧倒的な学習量を達成', '365日間連続で日報投稿', 'platinum', '継続', 'streak_days:365', 40),
    
    -- 学習量系
    ('posts_10', '探求心', '様々な分野に興味を持っている', '10件の日報を投稿', 'bronze', '学習', 'total_posts:10', 50),
    ('posts_50', '記録王', '学習日報を欠かさず記録している', '50件の日報を投稿', 'gold', '学習', 'total_posts:50', 55),
    ('posts_100', '努力賞', '継続的な努力を積み重ねている', '100件の日報を投稿', 'platinum', '学習', 'total_posts:100', 60),
    
    -- 学習時間系
    ('hours_10', '学習者', '10時間以上の学習を達成', '累計10時間の学習', 'bronze', '学習', 'total_hours:10', 70),
    ('hours_50', '勤勉家', '50時間以上の学習を達成', '累計50時間の学習', 'silver', '学習', 'total_hours:50', 75),
    ('hours_100', '知識人', '100時間以上の学習を達成', '累計100時間の学習', 'gold', '学習', 'total_hours:100', 80),
    
    -- コミュニケーション系
    ('chat_10', '質問力', 'メンターに積極的に質問している', 'メンターへの相談10回以上', 'silver', 'コミュニケーション', 'total_messages:10', 90),
    ('chat_50', '対話王', 'メンターと深いコミュニケーション', 'メンターへの相談50回以上', 'gold', 'コミュニケーション', 'total_messages:50', 95)

ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    condition_description = EXCLUDED.condition_description,
    rank = EXCLUDED.rank,
    category = EXCLUDED.category,
    condition_logic = EXCLUDED.condition_logic,
    sort_order = EXCLUDED.sort_order;
