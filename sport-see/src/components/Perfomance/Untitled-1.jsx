import styles from './Graph.module.css';


const Graph = () => {
  	return (
    		<div className={styles.graph}>
      			<div className={styles.statsKm}>
        				<div className={styles.header}>
          					<div className={styles.frameParent}>
            						<div className={styles.mainValueParent}>
              							<div className={styles.mainValue}>
                								<div className={styles.kmEnMoyenne}>18km en moyenne</div>
              							</div>
              							<div className={styles.totalDesKilomtres}>Total des kilomètres 4 dernières semaines</div>
            						</div>
            						<div className={styles.buttonParent}>
              							<div className={styles.button}>
                								<img className={styles.dropdownIcon} alt="" />
              							</div>
              							<div className={styles.content}>28 mai - 25 juin</div>
              							<div className={styles.button2}>
                								<img className={styles.dropdownIcon2} alt="" />
              							</div>
            						</div>
          					</div>
        				</div>
        				<div className={styles.newRecharts}>
          					<div className={styles.chartTimelineValue}>
            						<div className={styles.parent}>
              							<div className={styles.div}>30</div>
              							<div className={styles.div}>20</div>
              							<div className={styles.div}>10</div>
              							<div className={styles.div}> 0</div>
            						</div>
            						<img className={styles.chartTimeline} alt="" />
          					</div>
          					<div className={styles.subtitles}>
            						<div className={styles.subtitlesChild} />
          					</div>
          					<div className={styles.timeline}>
            						<div className={styles.s1Wrapper}>
              							<div className={styles.lun}>S1</div>
            						</div>
            						<div className={styles.s1Wrapper}>
              							<div className={styles.lun}>S2</div>
            						</div>
            						<div className={styles.s1Wrapper}>
              							<div className={styles.lun}>S3</div>
            						</div>
            						<div className={styles.s1Wrapper}>
              							<div className={styles.lun}>S4</div>
            						</div>
          					</div>
        				</div>
        				<div className={styles.dataContent}>
          					<div className={styles.intetityColorCircle}>
            						<div className={styles.intetityColorCircleChild} />
          					</div>
          					<div className={styles.div5}>
            						<div className={styles.content}>Km</div>
          					</div>
        				</div>
        				<div className={styles.statsKmChild} />
        				<div className={styles.statsKmItem} />
      			</div>
      			<div className={styles.statsBpm}>
        				<div className={styles.headerParent}>
          					<div className={styles.header2}>
            						<div className={styles.frameGroup}>
              							<div className={styles.mainValueParent}>
                								<div className={styles.mainValue}>
                  									<div className={styles.kmEnMoyenne}>163 BPM</div>
                								</div>
                								<div className={styles.totalDesKilomtres}>Fréquence cardiaque moyenne</div>
              							</div>
              							<div className={styles.buttonGroup}>
                								<div className={styles.button3}>
                  									<img className={styles.dropdownIcon} alt="" />
                								</div>
                								<div className={styles.mai04}>28 mai - 04 juin</div>
                								<div className={styles.button4}>
                  									<img className={styles.dropdownIcon2} alt="" />
                								</div>
              							</div>
            						</div>
          					</div>
          					<div className={styles.newRecharts2}>
            						<div className={styles.chartTimelineValue2}>
              							<div className={styles.group}>
                								<div className={styles.content}>187</div>
                								<div className={styles.content}>160</div>
                								<div className={styles.content}>145</div>
                								<div className={styles.content}>130</div>
              							</div>
              							<div className={styles.chartTimeline2}>
                								<img className={styles.chartTimelineChild} alt="" />
              							</div>
              							<img className={styles.chartTimelineValueChild} alt="" />
            						</div>
            						<div className={styles.subtitles}>
              							<div className={styles.subtitlesChild} />
            						</div>
            						<div className={styles.timeline2}>
              							<div className={styles.s1Wrapper}>
                								<div className={styles.lun}>Lun</div>
              							</div>
              							<div className={styles.s1Wrapper}>
                								<div className={styles.lun}>Mar</div>
              							</div>
              							<div className={styles.s1Wrapper}>
                								<div className={styles.lun}>Mer</div>
              							</div>
              							<div className={styles.s1Wrapper}>
                								<div className={styles.lun}>Jeu</div>
              							</div>
              							<div className={styles.s1Wrapper}>
                								<div className={styles.lun}>Ven</div>
              							</div>
              							<div className={styles.s1Wrapper}>
                								<div className={styles.lun}>Sam</div>
              							</div>
              							<div className={styles.s1Wrapper}>
                								<div className={styles.lun}>Dim</div>
              							</div>
            						</div>
          					</div>
        				</div>
        				<div className={styles.lgende}>
          					<div className={styles.dataContent2}>
            						<div className={styles.intetityColorCircle}>
              							<div className={styles.intetityColorCircleItem} />
            						</div>
            						<div className={styles.div5}>
              							<div className={styles.content}>Min</div>
            						</div>
          					</div>
          					<div className={styles.dataContent2}>
            						<img className={styles.intetityColorCircle3} alt="" />
            						<div className={styles.div5}>
              							<div className={styles.content}>Max BPM</div>
            						</div>
          					</div>
          					<div className={styles.dataContent2}>
            						<div className={styles.intetityColorCircle}>
              							<div className={styles.intetityColorCircleInner} />
              							<div className={styles.ellipseDiv} />
            						</div>
            						<div className={styles.div5}>
              							<div className={styles.content}>Max BPM</div>
            						</div>
          					</div>
        				</div>
        				<div className={styles.statsBpmChild} />
        				<div className={styles.statsBpmItem} />
      			</div>
    		</div>);
};

export default Graph ;
