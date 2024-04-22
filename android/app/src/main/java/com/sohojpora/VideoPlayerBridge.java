package com.sohojpora;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.WindowManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

public class VideoPlayerBridge extends ReactContextBaseJavaModule {
    ReactApplicationContext reactContext;
    VideoPlayerBridge(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "VideoPlayerBridge";
    }

    @ReactMethod
    void renderVideo() {

        ReactApplicationContext context = getReactApplicationContext();
        Intent intent = new Intent(context, VideoPlayerActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);

    }



}