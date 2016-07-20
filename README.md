# GPX Movement Faker

This tool allows you to create fake movement paths for xcode with predefined speeds. 

# Installation

1. Install [brew](http://brew.sh/)
1. Run `brew install node`
1. Run `npm install -g https://github.com/stefankendall/gpx-faker.git`

# Xcode Setup

## New Project

1. Open Xcode
1. Create a new project (File > New Project > Single View Application)
1. Build and run the application on your iPhone. You'll need to connect your phone with a lightning cable and select it in xcode here:
![xcode](docs/xcode1.png)
1. Congrats! You're now an iOS developer. You should see a white screen. Close the app for now; you'll need to run this new app from within xcode any time you want to fake location and movement.

## GPX Files

With the app running, you can fake location with Xcode's `Debug > Simulate Location` command. 

**Don't do that yet**. 

All of the prebuilt locations are static, known, and will get your account banned pretty immediately. We're going to be creating GPX files that xcode can read to set your location and move you around.
 
To add a gpx file to Xcode, drag it from finder into xcode anywhere intothe project. Accept the default options for adding files.

![xcode](docs/xcode2.png)

That's it! You can now select your gpx file from `Debug > Simulate Location`

# Creating fake locations and movement

There are currently two ways to create GPX files with this tool.

## Command Prompt

In any direction, run `gpxfaker`.

Enter a start coordinate:
    
    Start <lat>,<long>:
      
e.g: `35.000111,-77.121233`

Next, we're asked for a command. Hitting `[ENTER]` will choose the default in parentheses. We want to move, so we issue an `m` command.

    Command? (m)ove, (p)ause, (l)oop start or (q)uit:  (m)
   
Now we need a speed.

    Movement speed? (w)alk, (b)ike, or (c)ar:  (w) 
    
"w" for walk is a quick walking speed. This will count as steps, so long as you pause at each location you walk to. 
    
Choose an end location:

    End <lat>,<long>:
      
e.g: `35.000121,-77.123000`   

And then this loops back onto the command entry:

    Command? (m)ove, (p)ause, (l)oop start or (q)uit:  (m)
     
At this point, you should probably pause `p` or quit `q`. If you `quit`, a .gpx file will be written to `./paths/out.gpx`. You can rename this and drag it into xcode.
 
## Google maps directions urls 

This is the easier way to use the tool! Before you do this, you need to run `set +H` in terminal. You need to do this for each new terminal window, or you can add this to the bottom of your `~/.bash_profile` file.

Consider this example:

    gpxfaker -s w -p -l 10 -g "https://www.google.com/maps/dir/38.285047,-85.5695294/38.2743602,-85.5640632/38.2790561,-85.5480772/38.2911994,-85.5530793/38.2858161,-85.5693747/@38.2822743,-85.5561218,14.74z/data=!4m2!4m1!3e0"

Let's break the flags down.
### `-g <url>` 

google maps directions url. Note that it does NOT FOLLOW DIRECTIONS. Movement is a straight line between all the endpoints in the URL.
   
   
### `-s <speed>`
specify the speed. One of `w,b,c`.

### `-p`
pause at each endpoint.

### `-l <count>`
specify the number of loops.
 
# How not to look like you're teleporting across the world

1. Don't use wifi. This messes with location faking.
1. If you're going to teleport somewhere, teleport somewhere you could reasonably get to by car. 
1. Always teleport with location-aware apps force-closed. If you warp with them open, they can detect the warp.
1. Switch up the routes. Don't always walk perfect lines. This tool adds randomness to the points you enter, but the same GPX file will always run the same.

# Help

`gpxfaker --help` is the basic command reference. 