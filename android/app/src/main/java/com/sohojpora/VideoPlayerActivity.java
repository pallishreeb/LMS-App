package com.sohojpora;

import static androidx.core.content.ContentProviderCompat.requireContext;

import androidx.appcompat.app.AppCompatActivity;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;

import com.google.android.exoplayer2.ExoPlayer;
import com.google.android.exoplayer2.MediaItem;
import com.google.android.exoplayer2.Player;
import com.google.android.exoplayer2.SimpleBasePlayer;
import com.google.android.exoplayer2.SimpleExoPlayer;
import com.google.android.exoplayer2.source.ProgressiveMediaSource;
import com.google.android.exoplayer2.upstream.DefaultDataSource;
import com.google.android.exoplayer2.util.MimeTypes;
import com.sohojpora.databinding.ActivityVideoPlayerBinding;

public class VideoPlayerActivity extends AppCompatActivity {
    private ActivityVideoPlayerBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityVideoPlayerBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

//        setContentView(R.layout.activity_video_player);
//        WindowManager.LayoutParams params = getWindow().getAttributes();
//        params.width = WindowManager.LayoutParams.MATCH_PARENT; // Set desired width in pixels
//        params.height = 300; // Set desired height in pixels
//        getWindow().setAttributes(params);
        initView();
    }

    private ExoPlayer player;

    private void initView() {
//        player = findViewById(R.id.player_view);
        player = new SimpleExoPlayer.Builder(this).build();
        initializePlayer();
    }


    private void initializePlayer() {
        // Create a media item.
        MediaItem mediaItem = new MediaItem.Builder()
                .setUri("https://sohojpora.s3.ap-south-1.amazonaws.com/book_videos/file_example_MP4_1920_18MG.mp4")
                .setMimeType(MimeTypes.APPLICATION_MP4)
                .build();

        // Create a media source and pass the media item.
        ProgressiveMediaSource mediaSource = new ProgressiveMediaSource.Factory(
                new DefaultDataSource.Factory(this) // <- context
        ).createMediaSource(mediaItem);

        // Finally, assign this media source to the player.
        player.setMediaSource(mediaSource);
        player.setPlayWhenReady(true);
        player.seekTo(0, 0L);
        player.prepare();
        binding.feedVideo.setPlayer(player);
    }


    private void releasePlayer() {
        player.release();
        player = null;
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        releasePlayer();
    }
}