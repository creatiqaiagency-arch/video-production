"""Shot list + VO placement for "What If You Could See 5 Seconds Into the Future?".
Each block places its VO clips sequentially (gap_before seconds), then shots run back-to-back, each ending at an anchor:
  'N07'      start of clip N07            'N07.3'  start of phrase 3 of N07 (pauses detected in analyze_vo.py)
  'N07$'     end of clip N07              '+2.5'   2.5 s after the previous shot's end       'end' block end
  any anchor may carry an offset: 'N07$+0.6', 'N07.2-0.3'
SFX entries: (sfx_name, anchor, gain_db).  Music entries live in MUSIC (start anchor in a block, end anchor, gain_db).
"""

BLOCKS = [
  # ---------------- COLD OPEN (= the Future-B moment from the climax) ----------------
  dict(name='B01', vo=[('N01', 1.1)], shots=[
      ('s001', 'co_wide', 'N01+1.3'),
      ('s002', 'co_truckFront', 'N01$+0.2'),
      ('s003', 'co_eyes', '+1.4')],
      sfx=[('amb_city_night', 0, -14), ('sfx_truck_approach', 0.6, -6), ('sfx_heartbeat', 's002', -3), ('sfx_power', 's003+0.4', -2)]),
  dict(name='B02', vo=[('N02', 1.3)], shots=[
      ('s004', 'co_future', 'N02.1+0.3'),
      ('s005', 'co_rewind', 'N02$+0.7')],
      sfx=[('sfx_tinnitus', 0, -10), ('sfx_skid_horn', 0.3, -9), ('sfx_rewind', 's004$-0.1', -3)]),
  dict(name='B03', vo=[('N03', 0.3)], shots=[
      ('s006', 'co_leoFace', 'N03.1'),
      ('s007', 'co_title', 'N03.3'),
      ('s008', 'co_aerial', 'N03$+1.0')],
      sfx=[('sfx_whoosh', 's006', -6), ('sfx_swoosh_up', 's008', -6)]),
  # ---------------- ACT I ----------------
  dict(name='B04', vo=[('N04', 0.4)], shots=[
      ('s009', 'k_establish', 'N04.1'),
      ('s010', 'k_ghostGlass', 'N04$-0.3'),
      ('s010b', 'k_ghostShatter', '+1.3')],
      sfx=[('amb_kitchen', 0, -16), ('sfx_power', 's010', -8), ('sfx_glass_shatter', 's010b+0.2', -8)]),
  dict(name='B05', vo=[('N05', 0.1), ('L01', 0.25)], shots=[
      ('s011', 'k_leoDoubleTake', 'N05.1'),
      ('s011b', 'k_glassCU', 'N05$'),
      ('s012', 'k_leoConfused', 'L01$+0.4')]),
  dict(name='B06', vo=[('N06', 0.15), ('L02', 1.9)], shots=[
      ('s013', 'k_elbow', 'N06$+0.3'),
      ('s014', 'k_catch', '+1.6'),
      ('s015', 'k_whatThe', 'L02$+0.6')],
      sfx=[('sfx_glass_catch', 's014+0.6', -4)]),
  dict(name='B07', vo=[('N07', 0.2)], shots=[
      ('s016', 'k_rubEyes', 'N07.1'),
      ('s017', 'k_coinDrop', 'N07.3'),
      ('s018', 'k_coinOverhead', 'N07.4'),
      ('s019', 'k_coinPinch', 'N07.5'),
      ('s020', 'k_twoCoins', 'N07.6'),
      ('s021', 'k_fiveCoins', 'N07.7+1.0'),
      ('s022', 'k_grin', 'N07$+0.8')],
      sfx=[('sfx_coin_click', 's017+2.4', -7), ('sfx_coin_click', 's019+0.5', -6), ('sfx_coin_click', 's020+1.7', -6), ('sfx_coin_click', 's021+0.4', -7), ('sfx_coin_click', 's021+1.0', -7), ('sfx_coin_click', 's021+1.6', -7)]),
  dict(name='B08', vo=[('N08', 0.2)], shots=[
      ('s023', 'l_establish', 'N08.1'),
      ('s024', 'diag_timeline', 'N08.3'),
      ('s025', 'l_throwPOV', 'N08.4'),
      ('s026', 'l_previewFace', 'N08.4+2.3'),
      ('s026b', 'l_decide', 'N08.5'),
      ('s027', 'l_duck', 'N08.6'),
      ('s028', 'l_newPreview', 'N08$+0.3')],
      sfx=[('sfx_whoosh', 's025', -8), ('sfx_power', 's026', -9), ('sfx_whoosh', 's027', -8), ('sfx_power', 's028', -10)]),
  dict(name='B09', vo=[('N09', 0.1)], shots=[
      ('s029', 'l_shelfHit', 'N09.1-0.7'),
      ('s030', 'l_leoHorror', '+0.9'),
      ('s030b', 'l_diveCatch', '+2.0'),
      ('s030c', 'l_potSafe', 'N09$+0.2'),
      ('s031', 'l_potBase', '+0.9')],
      sfx=[('sfx_ball_shelf', 's029+0.2', -5), ('sfx_whoosh', 's030b', -6)]),
  # ---------------- ACT II ----------------
  dict(name='B10', vo=[('N10', 0.6), ('F01', 0.3)], shots=[
      ('s032', 'g_matchCut', 'N10.1'),
      ('s033', 'g_wide', 'N10.3'),
      ('s034', 'g_serveOTS', 'N10.4'),
      ('s035', 'g_overhead', 'N10$+0.2'),
      ('s036', 'g_samStunned', 'F01$+0.3'),
      ('s036b', 'g_noraCheer', '+1.2')],
      sfx=[('amb_gym', 0, -16), ('sfx_pingpong', 's034', -6), ('sfx_crowd_gasp', 's036b', -9)]),
  dict(name='B11', vo=[('N11', 0.2)], shots=[
      ('s037', 'a_pov', 'N11.1'),
      ('s038', 'a_score', 'N11.2'),
      ('s039', 'd_balls', 'N11.3+0.4'),
      ('s040', 'd_dodge', 'N11.4+0.6'),
      ('s041', 'd_disbelief', '+1.3'),
      ('s041b', 'd_jawDrop', '+1.0'),
      ('s041c', 'd_highFive', 'N11.5'),
      ('s042', 'hero_rays', 'N11$+0.8')],
      sfx=[('sfx_arcade', 's037', -8), ('sfx_dodgeball', 's039', -6), ('sfx_crowd_gasp', 's041', -10)]),
  dict(name='B12', vo=[('N12', 0.3), ('F02', 0.2), ('L03', -0.35), ('F03', 0.35)], shots=[
      ('s043', 'sw_phone', 'N12.2'),
      ('s044', 'c_cupSlide', 'N12.3'),
      ('s045', 'c_tableWide', 'N12$+0.1'),
      ('s046', 'c_samTalk', 'L03'),
      ('s047', 'c_leoSmug', 'L03$+0.2'),
      ('s048', 'c_samNora', 'F03$+0.5')],
      sfx=[('sfx_phone_catch', 's043+2.6', -5), ('amb_cafe', 's044', -15)]),
  dict(name='B13', vo=[('N13', 0.2)], shots=[
      ('s049', 'c_reverseWide', 'N13.1'),
      ('s050', 'c_ghostMouths', 'N13.4'),
      ('s051', 'c_leoMouthing', 'N13.5+0.5'),
      ('s052', 'c_leoSmileFades', 'N13.6'),
      ('s053', 'c_friendsTired', 'N13.6+2.1'),
      ('s053b', 'c_noraHurt', 'N13$+0.8')],
      sfx=[('amb_cafe', 0, -15)]),
  # ---------------- ACT III ----------------
  dict(name='B14', vo=[('N14', 0.4), ('O01', 2.2), ('N15', 0.5), ('L04', 0.35)], shots=[
      ('s054', 'c3_approach', 'N14.1'),
      ('s055', 'c3_eyeRing', 'N14$+0.4'),
      ('s056', 'c3_noraFuture', 'O01$+0.5'),
      ('s057', 'c3_leoFroze', 'L04$+0.6')],
      sfx=[('amb_cafe', 0, -17), ('sfx_power', 's055', -6), ('sfx_tinnitus', 's056', -14)]),
  dict(name='B15', vo=[('N16', 0.2), ('L05', 0.3), ('O02', 0.25), ('L06', 0.2), ('O03', 0.3), ('L07', 1.6)], shots=[
      ('s058', 'c3_eyesNarrow', 'N16.1'),
      ('s059', 'c3_march', 'N16$+0.3'),
      ('s060', 'c3_otsAccuse', 'L05$+0.2'),
      ('s061', 'c3_noraConfused', 'O02$+0.2'),
      ('s062', 'c3_leoPoint', 'L06$+0.15'),
      ('s063', 'c3_reveal', 'O03$+0.2'),
      ('s063b', 'c3_bannerInsert', '+1.3'),
      ('s064', 'c3_oh', 'L07$+1.0')],
      sfx=[('amb_cafe', 0, -17), ('sfx_awkward_cricket', 's064+0.8', -10)]),
  dict(name='B16', vo=[('N17', 0.2)], shots=[
      ('s065', 'c3_deflate', 'N17.1'),
      ('s066', 'c3_whatVsWhy', 'N17$+0.5')]),
  dict(name='B17', vo=[('N18', 0.3)], shots=[
      ('s067', 'c3_noraLeaves', 'N18.2'),
      ('s068', 'c3_ghostCallBack', 'N18.4'),
      ('s069', 'c3_aloneWide', 'N18$+2.2')]),
  # ---------------- ACT IV ----------------
  dict(name='B18', vo=[('N19', 0.6)], shots=[
      ('s070', 'n_walkTwoShot', 'N19.1'),
      ('s071', 'n_walkWide', 'N19$+0.5')],
      sfx=[('amb_city_night', 0, -15)]),
  dict(name='B19', vo=[('N20', 0.2)], shots=[
      ('s072', 'ix_establish', 'N20+2.3'),
      ('s073', 'ix_map', 'N20+5.0'),
      ('s074', 'ix_ballRoll', 'N20.1+0.3'),
      ('s075', 'ix_eyeRing', 'N20$+0.6')],
      sfx=[('amb_city_night', 0, -14), ('sfx_ball_bounce_street', 's074', -6), ('sfx_power', 's075', -4)]),
  dict(name='B20', vo=[('N21', 0.2)], shots=[
      ('s076', 'fa_child', 'N21.1'),
      ('s077', 'fa_truckWide', 'N21.2'),
      ('s078', 'fa_driver', 'N21$+0.2')],
      sfx=[('sfx_tinnitus', 0, -12), ('sfx_truck_approach', 's077', -8), ('sfx_heartbeat', 's078', -4)]),
  dict(name='B21', vo=[('N22', 0.2)], shots=[
      ('s079', 'p_pushOff', 'N22.1'),
      ('s080', 'fb_flicker', 'N22.2'),
      ('s081', 'fb_grabPush', 'N22.4'),
      ('s082', 'fb_leoHit', 'N22$+0.5')],
      sfx=[('sfx_whoosh', 's079+0.4', -6), ('sfx_power', 's080', -7), ('sfx_skid_horn', 's082', -9), ('sfx_heartbeat', 's082+1.5', -4)]),
  dict(name='B22', vo=[('N23', 0.2), ('L08', 0.1)], shots=[
      ('s082b', 'p_gasp', '+0.7'),
      ('s083', 'p_skid', 'N23.1+0.7'),
      ('s084', 'p_eyes2', 'N23.3'),
      ('s085', 'fc_noraRuns', 'N23.4'),
      ('s086', 'fc_noraDanger', 'N23$+0.15'),
      ('s087', 'p_no', 'L08$+0.4')],
      sfx=[('sfx_power', 's084+0.3', -7), ('sfx_heartbeat', 's086', -3)]),
  dict(name='B23', vo=[('N24', 0.3)], shots=[
      ('s088', 'triptych', 'N24.1'),
      ('s089', 'clockCU', 'N24.2+0.4'),
      ('s090', 'p_decide', 'N24$+0.4')],
      sfx=[('sfx_heartbeat', 's089', -3), ('sfx_heartbeat', 's089+0.9', -3)]),
  dict(name='B24', vo=[('N25', 0.2), ('L09', 0.3), ('L10', 2.2)], shots=[
      ('s091', 'p_breath', 'N25.1'),
      ('s092', 'p_turnToNora', 'N25$+0.3'),
      ('s093', 'p_shout1', 'L09$+0.1'),
      ('s093b', 'p_noraNod', '+1.0'),
      ('s094', 'p_noraTurns', '+1.2'),
      ('s095', 'p_shout2', 'L10$+0.1'),
      ('s096', 'p_guardReach', '+2.0'),
      ('s096b', 'p_grille', '+0.8')],
      sfx=[('amb_city_night', 's093', -11), ('sfx_truck_approach', 's094', -6), ('sfx_skid_horn', 's096b', -6)]),
  dict(name='B25', vo=[('N26', 0.1)], shots=[
      ('s097', 'p_stepBack', 'N26.1'),
      ('s098', 'p_truckThrough', 'N26.2+0.3'),
      ('s099', 'p_crash', 'N26$+1.4'),
      ('s099b', 'p_exhale', '+1.3'),
      ('s100', 'p_ballStops', '+2.6')],
      sfx=[('sfx_skid_horn', 's097+0.3', -4), ('sfx_crash', 's099+0.4', 0), ('sfx_ball_bounce_street', 's100+0.2', -12)]),
  dict(name='B26', vo=[('O04', 0.8), ('L11', 0.5), ('O05', 0.6), ('L12', 3.6)], shots=[
      ('s101', 'e_twoShot', 'O04$+0.4'),
      ('s102', 'e_leoYeah', 'L11$+0.5'),
      ('s103', 'e_noraAsk', 'O05$+0.4'),
      ('s104', 'e_ghostFade', 'L12-0.25'),
      ('s105', 'e_final', 'L12$+0.7'),
      ('s105b', 'e_noraSmile', '+1.4'),
      ('s105c', 'e_pullBack', '+4.4'),
      ('s106', 'black', '+1.0')],
      sfx=[('amb_city_night', 0, -20)]),
]

# music: (file, start_anchor 'Bxx[:anchor]', end_anchor, gain_db, fade_in, fade_out)
MUSIC = [
  ('mus_cold_open', 'B01', 'B03:s008', -16, 0.5, 2.0),
  ('mus_curious', 'B04', 'B09$', -20, 1.5, 1.5),
  ('mus_montage', 'B10', 'B12:s045', -19, 0.3, 2.5),
  ('mus_melancholy', 'B13:s052', 'B17$', -21, 3.0, 3.0),
  ('mus_tension', 'B19:s075', 'B25:s099', -18, 1.0, 0.2),
  ('mus_resolve', 'B26:s104', 'B26$', -16, 0.5, 2.0),
]
SPEAKER = {'N': 'narrator', 'L': 'leo', 'O': 'nora', 'F': 'sam'}
